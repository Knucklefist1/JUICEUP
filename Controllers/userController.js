const sql = require("mssql");
const bcrypt = require("bcrypt");
const config = require("../Config/Database");

// Funktion til at oprette en ny bruger
exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received data:", req.body);

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed");

    // Connect to the database
    await sql.connect(config);
    console.log("Connected to the database for sign-up");

    // Insert user data into Users table
    const request = new sql.Request();
    await request.query(`
      INSERT INTO Users (username, email, password_hash, created_at)
      VALUES ('${username}', '${email}', '${hashedPassword}', GETDATE())
    `);
    console.log("User data inserted into the database");

    res.status(201).send("User created successfully!");
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).send("An error occurred during user creation.");
  }
};
