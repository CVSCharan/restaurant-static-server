module.exports = {
  CREATE_RESTAURANT_USERS_TABLE_QUERY: `
      CREATE TABLE IF NOT EXISTS restaurant_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT CHECK (role IN ('admin', 'manager')) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `,
  CREATE_RESTAURANT_TABLES_TABLE_QUERY: `
      CREATE TABLE IF NOT EXISTS restaurant_tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_number INTEGER UNIQUE NOT NULL,
          status TEXT DEFAULT 'open',
          assigned_manager_id INTEGER,
          FOREIGN KEY (assigned_manager_id) REFERENCES restaurant_users(id)
      );
    `,
  CREATE_PRODUCTS_TABLE_QUERY: `
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
      );
    `,
  CREATE_ORDERS_TABLE_QUERY: `
      CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_id INTEGER NOT NULL,
          manager_id INTEGER NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (table_id) REFERENCES restaurant_tables(id),
          FOREIGN KEY (manager_id) REFERENCES restaurant_users(id)
      );
    `,
  CREATE_ORDER_ITEMS_TABLE_QUERY: `
      CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          total_price REAL NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id),
          FOREIGN KEY (product_id) REFERENCES products(id)
      );
    `,
  CREATE_BILLS_TABLE_QUERY: `
      CREATE TABLE IF NOT EXISTS bills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER NOT NULL,
          total_amount REAL NOT NULL,
          payment_status TEXT DEFAULT 'unpaid',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `,
};
