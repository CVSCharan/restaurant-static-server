// routes/products.js
const express = require("express");
const router = express.Router();

// Route to add a new product
router.post("/add", (req, res) => {
  const { name, desc, category, price, isVeg, imgUrl } = req.body;

  // Log the received data
  console.log(name, desc, category, price, isVeg, imgUrl);

  // Insert data using a parameterized query
  const queryInsert = `
    INSERT INTO products (name, description, category, price, is_veg, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  req.db.run(
    queryInsert,
    [name, desc, category, price, isVeg, imgUrl],
    function (err) {
      if (err) {
        console.error("Error inserting into table:", err);
        return res.status(500).send("Error inserting data into the database.");
      } else {
        console.log(`Product - ${name} - inserting success!!`);
        res.status(200).send("Product Inserted Successfully!!");
      }
    }
  );
});

router.get("/list", (req, res) => {
  const queryGet = `SELECT * FROM products`;

  req.db.all(queryGet, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving products:", err);
      res.status(500).json({ error: "Failed to retrieve products" });
    } else {
      console.info("Products Count - ", rows.length);
      res.status(200).json(rows);
    }
  });
});

module.exports = router;
