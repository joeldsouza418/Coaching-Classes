const User = require('../../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: error.message });
  }
}