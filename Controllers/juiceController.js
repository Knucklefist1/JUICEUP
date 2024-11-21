const sql = require("mssql");
const config = require("../Config/Database");

// Function to add a new juice
exports.addJuice = async (req, res) => {
  const { name, description, ingredients } = req.body; // Add ingredients to the request body
  const user_id = req.session.userId; // Retrieve the user ID from session

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in to create a juice." });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("user_id", sql.Int, user_id);
    request.input("name", sql.VarChar, name);
    request.input("description", sql.Text, description);

    const result = await request.query(`
      INSERT INTO Juice (user_id, name, description, created_at, votes)
      OUTPUT INSERTED.juice_id
      VALUES (@user_id, @name, @description, GETDATE(), 0)
    `);

    res.status(201).json({
      message: "Juice created successfully!",
      juice_id: juice_id,
    });
  } catch (err) {
    console.error("Error creating juice:", err);
    res.status(500).json({ error: "An error occurred while creating the juice." });
  }
};

