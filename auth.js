const jwt = require("jsonwebtoken");

// Use an environment variable for the secret or a hardcoded fallback (not recommended in production)
const JWT_SECRET = "restaurant-app";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(403).send("Invalid token. Access denied.");
  }
};

module.exports = verifyToken;