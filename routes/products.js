const express = require("express");
const router = express.Router();

// Route to add a new product
router.post("/add", (req, res) => {
  const { name, desc, category, price, isVeg, imgUrl } = req.body;

  console.log(name, desc, category, price, isVeg, imgUrl);

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

// Route to list all products
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

// Route to update the is_active status
router.put("/update/:id", (req, res) => {
  console.log("Update Product Active State");
  const { id } = req.params;
  const { isActive } = req.body;

  const queryUpdate = `
    UPDATE products
    SET isActive = ?
    WHERE id = ?
  `;

  req.db.run(queryUpdate, [isActive, id], function (err) {
    if (err) {
      console.error("Error updating product status:", err);
      return res
        .status(500)
        .send("Error updating product status in the database.");
    } else {
      console.log(`Product ID - ${id} - status updated to ${isActive}`);
      res.status(200).send("Product Status Updated Successfully!!");
    }
  });
});

module.exports = router;
