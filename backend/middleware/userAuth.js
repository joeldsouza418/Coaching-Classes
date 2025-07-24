const jwt = require('jsonwebtoken');

const UserAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for required data in token
    if (!decoded.userId || !decoded.role) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    // Attach user ID to request
    req.user = { userId: decoded.userId, role: decoded.role };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = UserAuth;