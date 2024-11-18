const sql = require("mssql");
const bcrypt = require("bcrypt");
const config = require("../Config/Database");

// Signup Function
exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await sql.connect(config);
    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    request.input("email", sql.VarChar, email);
    request.input("password_hash", sql.VarChar, hashedPassword);
    const result = await request.query(`
      INSERT INTO Users (username, email, password_hash, created_at)
      OUTPUT INSERTED.user_id
      VALUES (@username, @email, @password_hash, GETDATE())
    `);
    req.session.userId = result.recordset[0].user_id;
    res.status(201).json({ message: "User created and logged in successfully!" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ error: "An error occurred during sign-up." });
  }
};

// Login Function
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    const result = await request.query(`
      SELECT * FROM Users WHERE email = @email
    `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }
    req.session.userId = user.user_id;
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
};

exports.logoutUser = (req, res) => {
  console.log("Logout endpoint called");
  console.log("Session before destruction:", req.session);

  req.session.destroy(err => {
    if (err) {
      console.error("Error during session destruction:", err);
      return res.status(500).json({ error: "An error occurred during logout." });
    }

    // Clear the session cookie
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true,
      secure: false // Ensure this matches the setting from express-session
    });

    console.log("Logout successful, session destroyed.");
    res.status(200).json({ message: "Logout successful" });
  });
};


// Get user profile data
exports.getProfile = async (req, res) => {
  try {
      const userId = req.session.userId;

      // Ensure the user is logged in
      if (!userId) {
          return res.status(401).json({ error: "Unauthorized. Please log in." });
      }

      // Connect to the database and get user data
      await sql.connect(config);
      const request = new sql.Request();
      request.input("userId", sql.Int, userId);
      const result = await request.query(`
          SELECT first_name, last_name, email, phone_number 
          FROM Users 
          WHERE user_id = @userId
      `);

      if (result.recordset.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(result.recordset[0]);
  } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ error: "An error occurred while fetching the profile." });
  }
};

// Update user email
exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.session.userId;

  try {
      if (!userId) {
          return res.status(401).json({ error: "Unauthorized. Please log in." });
      }

      await sql.connect(config);
      const request = new sql.Request();
      request.input("email", sql.VarChar, email);
      request.input("userId", sql.Int, userId);

      await request.query(`
          UPDATE Users
          SET email = @email
          WHERE user_id = @userId
      `);

      res.status(200).json({ message: "Email updated successfully!" });
  } catch (err) {
      console.error("Error updating email:", err);
      res.status(500).json({ error: "An error occurred while updating the email." });
  }
};
