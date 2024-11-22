// server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 8080;

const productsRoute = require("./routes/products");
const staffRoute = require("./routes/staff");
const {
  CREATE_PRODUCTS_TABLE_QUERY,
  CREATE_ORDERS_TABLE_QUERY,
  CREATE_ORDER_ITEMS_TABLE_QUERY,
  CREATE_RESTAURANT_TABLES_TABLE_QUERY,
  CREATE_RESTAURANT_USERS_TABLE_QUERY,
  CREATE_BILLS_TABLE_QUERY,
} = require("./query");

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
db.run(CREATE_PRODUCTS_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'products' is ready.");
  }
});

// Create a Orders table
db.run(CREATE_ORDERS_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'orders' is ready.");
  }
});

// Create a Order_Items table
db.run(CREATE_ORDER_ITEMS_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'order_items' is ready.");
  }
});

// Create a Restaurant_Tables table
db.run(CREATE_RESTAURANT_TABLES_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'restaurant_tables' is ready.");
  }
});

// Create a Restaurant_Users table
db.run(CREATE_RESTAURANT_USERS_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'restaurant_users' is ready.");
  }
});

// Create a Bills table
db.run(CREATE_BILLS_TABLE_QUERY, (err) => {
  if (err) {
    console.error("Error creating table:", err);
  } else {
    console.log("Table 'bills' is ready.");
  }
});

// Create Indexes --> Orders(id), Order_Items(id), Bills(order_id)
db.exec(
  `
  CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders (table_id);
  CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
  CREATE INDEX IF NOT EXISTS idx_bills_order_id ON bills (order_id);
  `,
  (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Table Indexes are ready.");
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

// Poling the server for activeness
app.get("/api/ping", (req, res) => {
  res.status(200).send("Server is alive!");
});

// Pass the db connection to the products route
app.use(
  "/api/products",
  (req, res, next) => {
    req.db = db; // Add the db connection to the request object
    next(); // Call the next middleware or route handler
  },
  productsRoute
);

app.use(
  "/api/auth",
  (req, res, next) => {
    req.db = db; // Add the db connection to the request object
    next(); // Call the next middleware or route handler
  },
  staffRoute
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
