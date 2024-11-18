const sql = require("mssql");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../Config/Database");

// Opret SMTP-transporter til Gmail
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "juiceupxjoe@gmail.com",
    pass: "paov stey xhoa qxxx", // App password fra Gmail
  },
});

// Verificer forbindelsen til SMTP-serveren
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP verification error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

// Funktion til at sende bekræftelses-e-mail
async function mailToUser(recipients, subjectMsg, textMsg, htmlMsg) {
  try {
    const info = await transporter.sendMail({
      from: "juiceupxjoe@gmail.com",
      to: recipients,
      subject: subjectMsg,
      text: textMsg,
      html: htmlMsg,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Funktion til at oprette en ny bruger
exports.signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Connect to the database
    await sql.connect(config);

    // Insert user data into Users table
    const request = new sql.Request();
    await request.query(`
      INSERT INTO Users (username, email, password_hash, created_at)
      VALUES ('${username}', '${email}', '${hashedPassword}', GETDATE())
    `);

    // Send confirmation email
    const subjectMsg = "Welcome to our app!";
    const textMsg = `Hello ${username},\n\nThank you for signing up for our app!`;
    const htmlMsg = `<h1>Welcome, ${username}!</h1><p>Thank you for signing up for our app!</p>`;
    mailToUser(email, subjectMsg, textMsg, htmlMsg);

    res.status(201).json({ message: "User created successfully!" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ error: "An error occurred during user creation." });
  }
};

// Funktion til at logge brugeren ind
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);

    // Find the user by email
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);

    const result = await request.query(`
      SELECT * FROM Users WHERE email = @email
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.recordset[0];

    // Compare the entered password with the hashed password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Store user ID in session
    req.session.userId = user.id;

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
};
