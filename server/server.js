require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const cors = require("cors");
const corsOptions = {
    origin: ["https://localhost:5173"],
};

app.use(cors(corsOptions));

// Create connection pool
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 5
});
// Example endpoint to fetch data
app.get('/customers', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM customers');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '`SELECT * FROM customers` failed' });
    } finally {
        if (conn) conn.end();
    }
});

app.get('/parts', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM parts');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: '`SELECT * FROM parts` failed' });
    } finally {
        if (conn) conn.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
