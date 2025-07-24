const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const transporter = require('../../config/nodemailer');
const { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } = require('../../config/emailTemplates'); // Import the email template

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!role || !['student', 'admin', 'parent', 'teacher'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ key fixed: maxAge not maxage
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, role} = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxage: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to FitFusion",
      text: `Hello ${name},\n\nThank you for registering with FitFusion! We're excited to have you on board.\n\nBest regards,\nThe FitFusion Team`,
    };

    await transporter.sendMail(mailOptions)
    return res.status(200).json({ message: "Register successful" });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: error.message });
  }
}

exports.sendOtp = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
    user.verifyOtp = otp;
    user.verifyOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your OTP for FitFusion",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
      html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  }
  catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: error.message });
  }
}

exports.verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.userId;

  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.verifyOtp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (user.verifyOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }


    user.isVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpires = 0;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({ message: error.message });
  }
}

exports.isAuthenticated = (req, res) => {
  try {
    return res.status(200).json({ message: "User is authenticated" });
  }
  catch (error) {
    console.error("Authentication check error:", error);
    return res.status(500).json({ message: error.message });
  }
}

exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate a 6-digit OTP
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP for FitFusion",
      //text: `Your Password Reset OTP is ${otp}. It is valid for 10 minutes.`,
      html: PASSWORD_RESET_TEMPLATE.replace('{{otp}}', otp).replace('{{email}}', user.email)
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password Reset OTP sent successfully" });
  }
  catch (error) {
    console.error("Send reset OTP error:", error);
    return res.status(500).json({ message: error.message });
  }
}

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    if (user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpires = 0;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: error.message
    });
  }
}