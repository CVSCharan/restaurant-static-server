const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const verifyToken = require("../auth");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "restaurant-app";

router.post("/sign-up", verifyToken, (req, res) => {
  const { username, name, email, password, role } = req.body;

  // Log the received data
  console.log(username, name, email, password, role);

  // Check user role before allowing the action
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied. Only admins can add users.");
  }

  // Insert data using a parameterized query
  const queryInsert = `
        INSERT INTO restaurant_users (username, name, email, password, role)
        VALUES (?, ?, ?, ?, ?)
      `;

  // req.db.run(
  //   queryInsert,
  //   [username, name, email, password, role],
  //   function (err) {
  //     if (err) {
  //       console.error("Error inserting into table:", err);
  //       return res.status(500).send("Error inserting data into the database.");
  //     } else {
  //       console.log(`Restaurant User - ${name} - inserting success!!`);
  //       res.status(200).send("Restaurant User Added Successfully!!");
  //     }
  //   }
  // );
});

router.post("/log-in", (req, res) => {
  const { username, password } = req.body;

  // Log the received data
  console.log("Username:", username);

  // Query to get the user data
  const queryGet = `SELECT * FROM restaurant_users WHERE username = ?`;

  req.db.get(queryGet, [username], async (err, user) => {
    if (err) {
      console.error("Error getting user from table:", err);
      return res.status(500).send("Error retrieving data from the database.");
    }

    // Check if user exists
    if (!user) {
      return res.status(404).send("User not found.");
    }

    try {
      // Verify the password using bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate JWT with logged-in timestamp
        const loginTimestamp = new Date().toISOString();

        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            loggedInAt: loginTimestamp, // Adding the timestamp
          },
          JWT_SECRET
        );

        console.log(`User - ${username} - Log In success!!`);
        return res.status(200).json({
          message: "User Logged In Successfully!!",
          token,
          username: user.username,
          role: user.role,
          email: user.email,
          loggedInAt: loginTimestamp, // Also returning it in the response
        });
      } else {
        console.log(`User - ${username} - Incorrect password.`);
        return res.status(401).send("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return res.status(500).send("Error during password verification.");
    }
  });
});

module.exports = router;
