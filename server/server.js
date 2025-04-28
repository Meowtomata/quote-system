require("dotenv").config(); // Keep for MariaDB credentials
const express = require("express");
const mariadb = require("mariadb"); // MariaDB driver
const sqlite3 = require("sqlite3").verbose(); // SQLite driver
const cors = require("cors");
const path = require("path");
const fs = require("fs");

let schemaSql;
const schemaFilePath = path.join(__dirname, "schema.sql"); // Construct path relative to this script

try {
  // Read the SQL schema file synchronously
  // Using readFileSync is often acceptable here because schema loading
  // usually happens once at startup and needs to complete before proceeding.
  schemaSql = fs.readFileSync(schemaFilePath, "utf8");
  console.log("Successfully loaded schema from schema.sql");
} catch (err) {
  console.error("Error reading schema file:", schemaFilePath, err);
  // Decide how to handle the error: exit, use a default, etc.
  process.exit(1); // Exit if schema can't be loaded
}

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
const DBSOURCE = path.resolve(__dirname, "quoteDatabase.db");
let db; // Declare SQLite db variable

// Function to initialize SQLite DB (makes startup cleaner)
async function initializeSqliteDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      DBSOURCE,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        // Ensure file created if not exists
        if (err) {
          console.error("Error opening/creating SQLite database:", err.message);
          return reject(err);
        }
        console.log("Connected to the SQLite database.");

        db.run("PRAGMA foreign_keys = ON;", (pragmaErr) => {
          if (pragmaErr) {
            console.error(
              "SQLite: Error enabling foreign keys:",
              pragmaErr.message
            );
          } else {
            console.log("SQLite: Foreign key enforcement is on.");
          }
          db.exec(schemaSql, (execErr) => {
            if (execErr) {
              // Log non-critically, might just mean tables exist
              console.warn(
                "SQLite: Notice executing schema (may be normal if tables exist):",
                execErr.message
              );
            } else {
              console.log(
                "SQLite: Database schema checked/initialized successfully."
              );
            }
            resolve(); // Resolve the promise once setup is done/attempted
          });
        });
      }
    );
  });
}

// --- API Routes ---

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API is running (MariaDB & SQLite)" });
});

// --- MariaDB Routes ---

// GET Customers
app.get("/api/customers", async (req, res) => {
  if (!pool)
    return res.status(503).json({ error: "MariaDB pool not available" });
  let conn;
  try {
    conn = await pool.getConnection(); // Use MariaDB pool
    console.log("MariaDB: Connected for /api/customers");
    const rows = await conn.query("SELECT * FROM customers"); // Assuming 'customers' table exists in MariaDB
    res.json(rows);
  } catch (err) {
    console.error("MariaDB Error fetching customers:", err);
    res.status(500).json({
      error: "Failed to fetch customers from MariaDB",
      details: err.code || err.message,
    });
  } finally {
    if (conn) {
      console.log("MariaDB: Releasing connection for /api/customers");
      conn.release(); // Use release() for pool connections
    }
  }
});

// GET Parts
app.get("/api/parts", async (req, res) => {
  if (!pool)
    return res.status(503).json({ error: "MariaDB pool not available" });
  let conn;
  try {
    conn = await pool.getConnection(); // Use MariaDB pool
    console.log("MariaDB: Connected for /api/parts");
    const rows = await conn.query("SELECT * FROM parts"); // Assuming 'parts' table exists in MariaDB
    res.json(rows);
  } catch (err) {
    console.error("MariaDB Error fetching parts:", err);
    res.status(500).json({
      error: "Failed to fetch parts from MariaDB",
      details: err.code || err.message,
    });
  } finally {
    if (conn) {
      console.log("MariaDB: Releasing connection for /api/parts");
      conn.release(); // Use release() for pool connections
    }
  }
});

// --- SQLite Routes ---

// GET Sales Associates
app.get("/api/sales-associates", (req, res) => {
  if (!db) return res.status(503).json({ error: "SQLite database not ready" }); // Check SQLite connection
  db.all("SELECT * FROM Sales_Associate", [], (err, rows) => {
    // Use SQLite 'db'
    if (err) {
      console.error("SQLite Error fetching sales associates:", err.message);
      res
        .status(500)
        .json({ error: "SQLite query failed", details: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET full quote with line items and secret notes
app.get("/api/quotes/:id/details", (req, res) => {
  const quoteId = req.params.id;

  if (!db) return res.status(503).json({ error: "SQLite DB not ready" });

  const result = {
    quote: null,
    lineItems: [],
    secretNotes: [],
  };

  db.get("SELECT * FROM Quotes WHERE QU_ID = ?", [quoteId], (err, quoteRow) => {
    if (err) return res.status(500).json({ error: err.message });

    result.quote = quoteRow;

    db.all(
      "SELECT * FROM Line_Item WHERE QU_ID = ?",
      [quoteId],
      (err, lineRows) => {
        if (err) return res.status(500).json({ error: err.message });

        result.lineItems = lineRows;

        db.all(
          "SELECT * FROM SecretNotes WHERE QU_ID = ?",
          [quoteId],
          (err, noteRows) => {
            if (err) return res.status(500).json({ error: err.message });

            result.secretNotes = noteRows;

            res.json(result);
          }
        );
      }
    );
  });
});

// POST Endpoint for Creating Sales Associates (Uses SQLite)
app.post("/api/sales-associates", (req, res) => {
  const requestId = Date.now(); // Simple unique ID for logging
  console.log(`[${requestId}] POST /api/sales-associates - Request received.`);
  if (!db) return res.status(503).json({ error: "SQLite database not ready" }); // Check SQLite connection
  console.log("POST /api/sales-associates (SQLite) - Received body:", req.body);

  // --- 1. Extract and Validate Data ---
  // Use camelCase for JS variables, map to table columns later
  const { name, userId, password, address, accumulatedCommission } = req.body;

  // --- Basic Validation ---
  const errors = [];
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("Valid 'name' (string) is required.");
  }
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    errors.push("Valid 'userId' (string) is required.");
  }
  if (!password || typeof password !== "string" || password.trim() === "") {
    // !! SECURITY WARNING !! Passwords should NEVER be stored in plaintext.
    // Implement hashing (e.g., bcrypt) before storing in a real application.
    errors.push("Valid 'password' (string) is required.");
  }
  if (!address || typeof address !== "string" || address.trim() === "") {
    errors.push("Valid 'address' (string) is required.");
  }
  let commissionToInsert = 0; // Default value
  if (accumulatedCommission != null) {
    // Check if it was provided (could be 0)
    commissionToInsert = parseFloat(accumulatedCommission);
    if (isNaN(commissionToInsert)) {
      errors.push(
        "'accumulatedCommission' must be a valid number if provided."
      );
    }
  }

  if (errors.length > 0) {
    console.log(`[${requestId}] Validation errors:`, errors);
    return res.status(400).json({ error: errors.join(", ") });
  }

  // --- 2. Database Interaction (SQLite) ---
  const sql = `
        INSERT INTO Sales_Associate
            (Name, User_ID, Password, Address, Accumulated_Commission)
        VALUES (?, ?, ?, ?, ?);
    `;
  const params = [name, userId, password, address, commissionToInsert];

  console.log(
    `[${requestId}] Running INSERT INTO Sales_Associate with User_ID: ${userId}`
  );
  // !! SECURITY TODO: Hash the 'password' parameter here before inserting !!
  db.run(sql, params, function (err) {
    // Use a regular function to access `this.lastID`
    if (err) {
      console.error(`[${requestId}] SQLite Sales_Associate Insert Error:`, err);
      // Check for unique constraint violation (likely User_ID)
      if (
        err.code === "SQLITE_CONSTRAINT" &&
        err.message.includes(
          "UNIQUE constraint failed: Sales_Associate.User_ID"
        )
      ) {
        return res.status(409).json({
          // 409 Conflict is appropriate for duplicate unique keys
          error: "User_ID already exists.",
          details: err.message,
        });
      }
      // Handle other potential database errors
      return res.status(500).json({
        error: "Failed to create Sales Associate.",
        details: err.message,
      });
    }

    // Success!
    const newAssociateId = this.lastID; // Get the SA_ID of the inserted row
    console.log(
      `[${requestId}] SQLite: Sales Associate inserted SA_ID: ${newAssociateId}`
    );
    res.status(201).json({
      // 201 Created status code
      message: "Sales Associate created successfully (SQLite)",
      salesAssociateId: newAssociateId,
      userId: userId, // Optionally return some inserted data for confirmation
    });
  });
});

// --- Make sure your other existing code (db connection, app setup, etc.) remains ---

// GET Sales Associates
app.get("/api/quotes", (req, res) => {
  if (!db) return res.status(503).json({ error: "SQLite database not ready" }); // Check SQLite connection
  db.all("SELECT * FROM quotes", [], (err, rows) => {
    // Use SQLite 'db'
    if (err) {
      console.error("SQLite Error fetching quotes:", err.message);
      res
        .status(500)
        .json({ error: "SQLite query failed", details: err.message });
      return;
    }
    res.json({
      message: "success (SQLite)",
      data: rows,
    });
  });
});

// POST Endpoint for Creating Quotes (Uses SQLite)
app.post("/api/quotes", (req, res) => {
  const requestId = Date.now(); // Simple unique ID for logging
  console.log(`[${requestId}] POST /api/quotes - Request received.`);
  if (!db) return res.status(503).json({ error: "SQLite database not ready" }); // Check SQLite connection
  console.log("POST /api/quotes (SQLite) - Received body:", req.body);

  // --- 1. Extract and Validate Data ---
  const {
    customerId,
    email,
    discountAmount,
    isPercentage,
    lineItems,
    secretNotes,
  } = req.body;
  const salesAssociateId = 1; // !! Replace with actual auth logic !!

  // --- Basic Validation ---
  const errors = [];
  if (customerId == null || customerId < 0)
    errors.push("Valid Customer ID required (from MariaDB source).");
  // ... (Add more robust validation as before) ...
  if (!Array.isArray(lineItems) || lineItems.length === 0)
    errors.push("Need line items.");
  if (errors.length > 0)
    return res.status(400).json({ error: errors.join(", ") });

  const createdDate = new Date().toISOString();
  const defaultStatus = "Draft";

  // --- 2. Database Transaction (SQLite) ---
  db.serialize(() => {
    // Use SQLite 'db'
    db.run("BEGIN TRANSACTION;", (err) => {
      if (err) {
        /* handle error */ return res
          .status(500)
          .json({ error: "SQLite TX Begin Error" });
      }

      const quoteSql = `INSERT INTO Quotes (SA_ID, CU_ID, Email, Discount_Amount, isPercentage) VALUES (?, ?, ?, ?, ?)`;
      const quoteParams = [
        salesAssociateId,
        customerId,
        email,
        discountAmount,
        isPercentage,
      ];

      console.log(
        `Running INSERT INTO Quotes with values ${salesAssociateId}, ${customerId}, ${discountAmount}, ${isPercentage}`
      );
      db.run(quoteSql, quoteParams, function (err) {
        if (err) {
          console.log(err);
          db.run("ROLLBACK");
          return res.status(500).json({ error: "SQLite Quote Insert Error" });
        }
        const quoteId = this.lastID;
        console.log(`SQLite: Quote inserted QU_ID: ${quoteId}`);
        handleLineItemsInsert(res, db, quoteId, lineItems, secretNotes); // Proceed to line items
      });
    });
  });
});

// PUT Endpoint to update quote status (e.g., from Draft to Sanctioned or Ordered)
app.put("/api/quotes/:id/status", (req, res) => {
  const quoteId = req.params.id;
  const { newStatus } = req.body;

  if (!newStatus || typeof newStatus !== "string") {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'newStatus' value." });
  }

  if (!db) {
    return res.status(503).json({ error: "SQLite database not ready" });
  }

  const validStatuses = ["Draft", "Finalized", "Sanctioned", "Ordered"];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({
      error: `'newStatus' must be one of: ${validStatuses.join(", ")}`,
    });
  }

  db.run(
    "UPDATE Quotes SET Status = ? WHERE QU_ID = ?",
    [newStatus, quoteId],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "Failed to update quote status",
          details: err.message,
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "No quote found with that ID" });
      }

      res.status(200).json({
        message: "Quote status updated successfully",
        updatedQuoteId: quoteId,
      });
    }
  );
});

// PUT endpoint to update an entire quote
app.put("/api/quotes/:id", (req, res) => {
  const quoteId = req.params.id;
  const {
    customerId,
    email,
    discountAmount,
    isPercentage,
    lineItems,
    secretNotes,
  } = req.body;

  if (!db) {
    return res.status(503).json({ error: "SQLite database not ready" });
  }

  // Update the main quote
  db.run(
    "UPDATE Quotes SET CU_ID = ?, Email = ?, Discount_Amount = ?, isPercentage = ? WHERE QU_ID = ?",
    [customerId, email, discountAmount, isPercentage ? 1 : 0, quoteId],
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to update quote", details: err.message });
      }

      return res.status(200).json({ message: "Quote updated successfully" });
    }
  );
});

// --- Helper Functions for SQLite Quote Creation ---
// Helper to insert Line Items then call Secret Notes helper
function handleLineItemsInsert(res, db, quoteId, lineItems, secretNotes) {
  const lineItemSql =
    "INSERT INTO Line_Item (QU_ID, Description, Price) VALUES (?, ?, ?)";
  let lineItemInsertError = null;
  let itemsProcessed = 0;
  const itemsToProcess = lineItems.length;

  lineItems.forEach((item) => {
    const price = parseFloat(item.price); // Ensure price is numeric
    if (isNaN(price)) {
      lineItemInsertError = new Error(
        `Invalid price for item: ${item.description}`
      );
      itemsProcessed++; // Still count as processed for completion check
      return; // Skip db.run for this invalid item
    }
    db.run(lineItemSql, [quoteId, item.description, price], function (err) {
      itemsProcessed++;
      if (err) {
        lineItemInsertError = err;
        console.error("SQLite Line Item Insert Error:", err.message);
      }
      if (itemsProcessed === itemsToProcess) {
        // Check if all attempted
        if (lineItemInsertError) {
          db.run("ROLLBACK");
          return res.status(500).json({
            error: "Failed to insert one or more line items.",
            details: lineItemInsertError.message,
          });
        }
        handleSecretNotesInsert(res, db, quoteId, secretNotes || []); // Ensure secretNotes is array
      }
    });
  });
}

// Helper to insert Secret Notes then commit
function handleSecretNotesInsert(res, db, quoteId, secretNotes) {
  const notesToProcess = secretNotes.length;
  if (notesToProcess === 0) {
    commitTransactionAndRespond(res, db, quoteId);
    return;
  }

  const noteSql = "INSERT INTO SecretNotes (QU_ID, NoteText) VALUES (?, ?)";
  let noteInsertError = null;
  let notesProcessed = 0;
  secretNotes.forEach((note) => {
    db.run(noteSql, [quoteId, note.noteText || ""], function (err) {
      // Handle potentially null noteText
      notesProcessed++;
      if (err) {
        noteInsertError = err;
        console.error("SQLite Secret Note Insert Error:", err.message);
      }
      if (notesProcessed === notesToProcess) {
        // Check if all attempted
        if (noteInsertError) {
          db.run("ROLLBACK");
          return res.status(500).json({
            error: "Failed to insert one or more secret notes.",
            details: noteInsertError.message,
          });
        }
        commitTransactionAndRespond(res, db, quoteId);
      }
    });
  });
}

// Helper to commit transaction and respond
function commitTransactionAndRespond(res, db, finalQuoteId) {
  console.log(`[${finalQuoteId}] Attempting to send success response...`);
  db.run("COMMIT;", (commitErr) => {
    if (commitErr) {
      db.run("ROLLBACK");
      return res
        .status(500)
        .json({ error: "SQLite Commit Error", details: commitErr.message });
    }
    console.log(`SQLite: Transaction committed for Quote ID: ${finalQuoteId}.`);
    res.status(201).json({
      message: "Quote created successfully (SQLite)",
      quoteId: finalQuoteId,
    });
  });
}

// --- 404 Handler (Define AFTER all other routes) ---
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// --- Start Server AFTER SQLite Database Initialization ---
initializeSqliteDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log("MariaDB Pool and SQLite DB are ready.");
    });
  })
  .catch((err) => {
    console.error(
      "FATAL ERROR: Failed to initialize SQLite database. Server not started.",
      err
    );
    // Attempt to close MariaDB pool if it was created before exiting
    if (pool) {
      pool
        .end()
        .catch((poolErr) =>
          console.error(
            "Error closing MariaDB pool during failed startup:",
            poolErr
          )
        );
    }
    process.exit(1); // Exit if DB init fails
  });

// --- Graceful Shutdown for BOTH Databases ---
process.on("SIGINT", async () => {
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
          console.log("SQLite database connection closed.");
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
      pool
        .end()
        .then(() => {
          console.log("MariaDB connection pool closed.");
          poolClosed = true;
          resolve();
        })
        .catch((err) => {
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
