const sql = require("mssql");
const bcrypt = require("bcrypt");
const config = require("../Config/Database");
const sendConfirmationEmail = require("../Public/js/EmailService"); // Import EmailService

// Funktion til oprettelse af bruger
exports.signupUser = async (req, res) => {
  const { username, email, password, phone_number } = req.body; // Inkluder telefonnummer
  try {
    await sql.connect(config);
    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.VarChar, email);

    // Tjek om email allerede eksisterer
    const checkResult = await checkRequest.query(`
      SELECT * FROM Users WHERE email = @email
    `);

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ error: "Email eksisterer allerede. Brug en anden email." });
    }

    // Hash password og indsæt ny bruger hvis email er unik
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const request = new sql.Request();
    request.input("username", sql.VarChar, username);
    request.input("email", sql.VarChar, email);
    request.input("phone_number", sql.VarChar, phone_number); // Nyt telefonnummer felt
    request.input("password_hash", sql.VarChar, hashedPassword);

    const result = await request.query(`
      INSERT INTO Users (username, email, phone_number, password_hash, created_at)
      OUTPUT INSERTED.user_id
      VALUES (@username, @email, @phone_number, @password_hash, GETDATE())
    `);

    req.session.userId = result.recordset[0].user_id;

    // Send bekræftelsesmail
    const subjectMsg = "Velkommen til JuiceApp!";
    const textMsg = `Hej ${username},\n\nTak fordi du oprettede en konto hos JuiceApp. Nyd vores services!`;
    const htmlMsg = `<h1>Velkommen, ${username}!</h1><p>Tak fordi du oprettede en konto hos JuiceApp. Nyd vores services!</p>`;

    await sendConfirmationEmail(email, subjectMsg, textMsg, htmlMsg);

    res.status(201).json({ message: "Bruger oprettet og logget ind med succes!" });
  } catch (err) {
    console.error("Fejl under oprettelse:", err);
    res.status(500).json({ error: "Der opstod en fejl under oprettelsen." });
  }
};

// Funktion til login
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
      return res.status(404).json({ error: "Bruger ikke fundet" });
    }

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Ugyldigt password" });
    }

    req.session.userId = user.user_id;
    res.status(200).json({ message: "Login succesfuldt" });
  } catch (err) {
    console.error("Fejl under login:", err);
    res.status(500).json({ error: "Der opstod en fejl under login." });
  }
};

// Funktion til logout
exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Fejl under logout:", err);
      return res.status(500).json({ error: "Der opstod en fejl under logout." });
    }

    // Ryd session cookie
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: true, // Kun for HTTPS
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Logout succesfuldt" });
  });
};

// Funktion til at hente brugerprofil
exports.getProfile = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ error: "Uautoriseret. Log venligst ind." });
    }

    await sql.connect(config);
    const request = new sql.Request();
    request.input("userId", sql.Int, userId);
    const result = await request.query(`
      SELECT username, email, phone_number, created_at
      FROM Users 
      WHERE user_id = @userId
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Bruger ikke fundet" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Fejl ved hentning af profil:", err);
    res.status(500).json({ error: "Der opstod en fejl under hentning af profilen." });
  }
};

// Funktion til at opdatere email
exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.session.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Uautoriseret. Log venligst ind." });
    }

    if (!email) {
      return res.status(400).json({ error: "Email er påkrævet." });
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
      return res.status(404).json({ error: "Bruger ikke fundet eller email ikke opdateret." });
    }

    res.status(200).json({ message: "Email opdateret med succes!" });
  } catch (err) {
    console.error("Fejl under opdatering af email:", err);
    res.status(500).json({ error: "Der opstod en fejl under opdatering af email." });
  }
};

// Funktion til at opdatere password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.session.userId;

  try {
    if (!userId) {
      return res.status(401).json({ error: "Uautoriseret. Log venligst ind." });
    }

    await sql.connect(config);
    const request = new sql.Request();
    request.input("userId", sql.Int, userId);

    const result = await request.query(`
      SELECT password_hash FROM Users WHERE user_id = @userId
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Bruger ikke fundet" });
    }

    const user = result.recordset[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Nuværende password er forkert." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updateRequest = new sql.Request();
    updateRequest.input("userId", sql.Int, userId);
    updateRequest.input("newPasswordHash", sql.VarChar, hashedNewPassword);

    await updateRequest.query(`
      UPDATE Users
      SET password_hash = @newPasswordHash
      WHERE user_id = @userId
    `);

    res.status(200).json({ message: "Password opdateret med succes!" });
  } catch (err) {
    console.error("Fejl under opdatering af password:", err);
    res.status(500).json({ error: "Der opstod en fejl under opdatering af password." });
  }
};
