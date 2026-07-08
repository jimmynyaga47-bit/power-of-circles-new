const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// =========================
// Register
// =========================
const register = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Every newly created admin/user waits for approval
    const newUser = await pool.query(
      `INSERT INTO users
      (name,email,password_hash,role_id,approved)
      VALUES($1,$2,$3,$4,FALSE)
      RETURNING id,name,email,role_id,approved`,
      [
        name,
        email,
        password_hash,
        role_id || 2,
      ]
    );

    res.status(201).json({
      message:
        "Account created successfully. Wait for administrator approval.",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// Login
// =========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      `SELECT users.*, roles.name AS role_name
       FROM users
       LEFT JOIN roles
       ON users.role_id = roles.id
       WHERE users.email = $1`,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const currentUser = user.rows[0];

    const isMatch = await bcrypt.compare(
      password,
      currentUser.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Account disabled
    if (!currentUser.is_active) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // Waiting approval
    if (!currentUser.approved) {
      return res.status(403).json({
        message: "Account pending admin approval",
      });
    }

    const token = jwt.sign(
      {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role_name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,

      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role_name,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// Current User
// =========================
const getMe = async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT
        users.id,
        users.name,
        users.email,
        users.approved,
        users.is_active,
        roles.name AS role
      FROM users
      LEFT JOIN roles
      ON users.role_id = roles.id
      WHERE users.id = $1`,
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: user.rows[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};