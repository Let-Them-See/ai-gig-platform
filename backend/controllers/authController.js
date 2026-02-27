const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// helper to sign access and refresh tokens
function signTokens(user) {
  const access = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRES || "15m" }
  );
  const refresh = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRES || "7d" }
  );
  return { access, refresh };
}

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { access, refresh } = signTokens(user);

    // set access and refresh tokens as httpOnly cookies (optional but useful for SPA)
    res.cookie("accessToken", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "Login successful",
      token: access
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= REFRESH TOKEN =================
exports.refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    jwt.verify(token, process.env.REFRESH_SECRET || process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Invalid refresh token" });
      // issue new access token
      const access = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_EXPIRES || "15m"
      });
      res.json({ token: access });
    });
  } catch (error) {
    console.error("REFRESH ERROR", error);
    res.status(500).json({ message: "Could not refresh token" });
  }
};

// ================= UPDATE SKILLS =================
exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      { new: true }
    );

    res.json({
      message: "Skills updated successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { location, expectedPay } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location, expectedPay },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};