const sql = require("mssql");
const bcrypt = require("bcrypt");
const config = require("../Config/Database");
const sendConfirmationEmail = require("../Public/js/EmailService"); // Importér EmailService

// Signup Function

exports.signupUser = async (req, res) => {
  const { username, email, password, phone_number } = req.body; // Added phone_number
  try {
    await sql.connect(config);
    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.VarChar, email);

    // Check if email already exists
    const checkResult = await checkRequest.query(`
      SELECT * FROM Users WHERE email = @email
    `);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: "Email already exists. Please use a different email." });
    }

    // Hash password and insert new user if email does not exist
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    request.input("email", sql.VarChar, email);
    request.input("phone_number", sql.VarChar, phone_number); // New phone number input
    request.input("password_hash", sql.VarChar, hashedPassword);

    const result = await request.query(`
      INSERT INTO Users (username, email, phone_number, password_hash, created_at)
      OUTPUT INSERTED.user_id
      VALUES (@username, @email, @phone_number, @password_hash, GETDATE())
    `);

    req.session.userId = result.recordset[0].user_id;

    // Send confirmation email
    const subjectMsg = "Welcome to JuiceApp!";
    const textMsg = `Hello ${username},\n\nThank you for signing up with JuiceApp. Enjoy our services!`;
    const htmlMsg = `<h1>Welcome, ${username}!</h1><p>Thank you for signing up with JuiceApp. Enjoy our services!</p>`;

    sendConfirmationEmail(email, subjectMsg, textMsg, htmlMsg);

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
          console.error("Error during logout:", err);
          return res.status(500).json({ error: "An error occurred during logout." });
      }

      // Clear the session cookie
      res.clearCookie("connect.sid", {
          path: "/",        // Must match the path from express-session
          httpOnly: true,   // Match with the httpOnly setting in express-session
          secure: false     // Must match the secure setting (true if HTTPS, false if HTTP)
      });

    console.log("Logout successful, session destroyed.");
    res.status(200).json({ message: "Logout successful" });
  });
};

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
      SELECT username, email, phone_number, created_at
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

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    await sql.connect(config);
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    request.input("userId", sql.Int, userId);

    const result = await request.query(`
      UPDATE Users
      SET email = @email
      WHERE user_id = @userId
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found or email not updated." });
    }

    res.status(200).json({ message: "Email updated successfully!" });
  } catch (err) {
    console.error("Error updating email:", err);
    res.status(500).json({ error: "An error occurred while updating the email." });
  }
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Connect to the database and get the user's current password hash
    await sql.connect(config);
    const request = new sql.Request();
    request.input("userId", sql.Int, userId);

    const result = await request.query(`
      SELECT password_hash FROM Users WHERE user_id = @userId
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    // Check if the current password is correct
    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    const updateRequest = new sql.Request();
    updateRequest.input("userId", sql.Int, userId);
    updateRequest.input("newPasswordHash", sql.VarChar, hashedNewPassword);

    await updateRequest.query(`
      UPDATE Users
      SET password_hash = @newPasswordHash
      WHERE user_id = @userId
    `);

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "An error occurred while updating the password." });
  }
};
