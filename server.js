// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 8080;

const productsRoute = require("./routes/products");

app.use(express.json()); // Middleware to parse JSON data
app.use(cors());

// Initialize the SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create a Products table
db.run(
  `
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price REAL NOT NULL,
    is_veg BOOLEAN NOT NULL CHECK (is_veg IN (0, 1)),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (price >= 0)
)
`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table 'products' is ready.");
    }
  }
);

db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, rows) => {
  if (err) {
    console.error("Error retrieving tables:", err.message);
  } else {
    const tables = rows.map((row) => row.name);
    console.log("Tables in the database:", tables);
  }
});

// Pass the db connection to the products route
app.use("/api/products", (req, res, next) => {
  req.db = db; // Add the db connection to the request object
  next(); // Call the next middleware or route handler
}, productsRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});