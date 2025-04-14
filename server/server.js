require('dotenv').config(); // Keep for MariaDB credentials
const express = require('express');
const mariadb = require('mariadb'); // MariaDB driver
const sqlite3 = require('sqlite3').verbose(); // SQLite driver
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow common dev origins
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json()); // Parses incoming JSON request bodies

// --- MariaDB Connection Pool (for Customers, Parts) ---
let pool; // Declare pool variable
try {
    pool = mariadb.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT || 3306, // Ensure default port if not in .env
        connectionLimit: 5,
        // Recommended settings for pool reliability
        acquireTimeout: 10000, // 10 seconds
        idleTimeout: 60000, // 60 seconds idle before potential release
        queueLimit: 0, // No limit on waiting connections (use with caution)
    });
    console.log("MariaDB connection pool created successfully.");
} catch (err) {
    console.error("FATAL ERROR: Failed to create MariaDB connection pool.", err);
    process.exit(1); // Exit if essential pool cannot be created
}


// --- SQLite Database Connection & Setup (for Quotes) ---
const DBSOURCE = path.resolve(__dirname, "mydatabase.db");
let db; // Declare SQLite db variable

// Function to initialize SQLite DB (makes startup cleaner)
async function initializeSqliteDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DBSOURCE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => { // Ensure file created if not exists
            if (err) {
                console.error("Error opening/creating SQLite database:", err.message);
                return reject(err);
            }
            console.log('Connected to the SQLite database.');

            db.run('PRAGMA foreign_keys = ON;', (pragmaErr) => {
                if (pragmaErr) {
                    console.error("SQLite: Error enabling foreign keys:", pragmaErr.message);
                } else {
                    console.log("SQLite: Foreign key enforcement is on.");
                }

                // Your CORRECTED SQL Schema Script for SQLite
                const schemaSql = `
                    -- Table: Sales_Associate
                    CREATE TABLE IF NOT EXISTS Sales_Associate (
                        SA_ID INT PRIMARY KEY,
                        Name TEXT,
                        User_ID TEXT UNIQUE,
                        Password TEXT,
                        Address TEXT,
                        Accumulated_Commission REAL 
                    );

                    -- Table: Quotes
                    CREATE TABLE IF NOT EXISTS Quotes (
                        QU_ID INTEGER PRIMARY KEY AUTOINCREMENT, -- Quote ID
                        SA_ID INTEGER,             -- Sales Associate ID
                        CU_ID INTEGER,             -- Customer ID
                        Status TEXT,
                        Discount_Amount REAL,
                        isPercentage INT,
                        Created_Date DATE DEFAULT CURRENT_TIMESTAMP,
                        Finalized_Date DATE,
                        FOREIGN KEY (SA_ID) REFERENCES Sales_Associate(SA_ID)
                    );

                    -- Table: Line_Item
                    CREATE TABLE IF NOT EXISTS Line_Item (
                        LI_ID INTEGER PRIMARY KEY,
                        QU_ID INTEGER,
                        Description TEXT,
                        Price REAL,
                        FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
                    );

                    -- Table: SecretNotes
                    CREATE TABLE IF NOT EXISTS SecretNotes (
                        SN_ID INTEGER PRIMARY KEY,
                        QU_ID INTEGER,
                        NoteText TEXT,
                        FOREIGN KEY (QU_ID) REFERENCES Quotes(QU_ID)
                    );
                `; // Removed trailing comma, added IF NOT EXISTS, adjusted types

                db.exec(schemaSql, (execErr) => {
                    if (execErr) {
                        // Log non-critically, might just mean tables exist
                        console.warn("SQLite: Notice executing schema (may be normal if tables exist):", execErr.message);
                    } else {
                        console.log("SQLite: Database schema checked/initialized successfully.");
                    }
                    resolve(); // Resolve the promise once setup is done/attempted
                });
            });
        });
    });
}

// --- API Routes ---

// Root route
app.get('/', (req, res) => {
    res.json({ "message": "API is running (MariaDB & SQLite)" });
});

// --- MariaDB Routes ---

// GET Customers
app.get('/api/customers', async (req, res) => {
    if (!pool) return res.status(503).json({ error: "MariaDB pool not available" });
    let conn;
    try {
        conn = await pool.getConnection(); // Use MariaDB pool
        console.log("MariaDB: Connected for /api/customers");
        const rows = await conn.query('SELECT * FROM customers'); // Assuming 'customers' table exists in MariaDB
        res.json(rows);
    } catch (err) {
        console.error("MariaDB Error fetching customers:", err);
        res.status(500).json({ error: 'Failed to fetch customers from MariaDB', details: err.code || err.message });
    } finally {
        if (conn) {
            console.log("MariaDB: Releasing connection for /api/customers");
            conn.release(); // Use release() for pool connections
        }
    }
});

// GET Parts
app.get('/api/parts', async (req, res) => {
    if (!pool) return res.status(503).json({ error: "MariaDB pool not available" });
    let conn;
    try {
        conn = await pool.getConnection(); // Use MariaDB pool
        console.log("MariaDB: Connected for /api/parts");
        const rows = await conn.query('SELECT * FROM parts'); // Assuming 'parts' table exists in MariaDB
        res.json(rows);
    } catch (err) {
        console.error("MariaDB Error fetching parts:", err);
        res.status(500).json({ error: 'Failed to fetch parts from MariaDB', details: err.code || err.message });
    } finally {
        if (conn) {
            console.log("MariaDB: Releasing connection for /api/parts");
            conn.release(); // Use release() for pool connections
        }
    }
});


// --- SQLite Routes ---

// GET Sales Associates
app.get('/api/sales-associates', (req, res) => {
    if (!db) return res.status(503).json({"error": "SQLite database not ready"}); // Check SQLite connection
    db.all("SELECT SA_ID, Name, User_ID, Address, Accumulated_Commission FROM Sales_Associate", [], (err, rows) => { // Use SQLite 'db'
         if (err) {
             console.error("SQLite Error fetching sales associates:", err.message);
             res.status(500).json({"error": "SQLite query failed", "details": err.message});
             return;
         }
         res.json({
             "message": "success (SQLite)",
             "data": rows
         });
    });
});

// --- 404 Handler (Define AFTER all other routes) ---
app.use((req, res) => {
    res.status(404).json({ "error": "Endpoint not found" });
});
// --- Graceful Shutdown for BOTH Databases ---
process.on('SIGINT', async () => {
    console.log("SIGINT received. Closing connections...");
    let exitCode = 0;
    let dbClosed = false;
    let poolClosed = false;

    // Close SQLite
    const closeDbPromise = new Promise((resolve) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error("Error closing SQLite database:", err.message);
                    exitCode = 1;
                } else {
                    console.log('SQLite database connection closed.');
                }
                dbClosed = true;
                resolve();
            });
        } else {
            dbClosed = true;
            resolve();
        }
    });

    // Close MariaDB Pool
    const closePoolPromise = new Promise((resolve) => {
        if (pool) {
            pool.end()
                .then(() => {
                    console.log('MariaDB connection pool closed.');
                    poolClosed = true;
                    resolve();
                })
                .catch(err => {
                    console.error("Error closing MariaDB pool:", err);
                    exitCode = 1;
                    poolClosed = true; // Still consider it "processed" for exiting
                    resolve();
                });
        } else {
            poolClosed = true;
            resolve();
        }
    });

    // Wait for both to finish closing
    await Promise.all([closeDbPromise, closePoolPromise]);

    console.log("Exiting process.");
    process.exit(exitCode);
});


