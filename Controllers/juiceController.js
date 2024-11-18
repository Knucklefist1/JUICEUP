const sql = require("mssql");
const config = require("../Config/Database");

exports.addJuice = async (req, res) => {
  const { user_id, name, description } = req.body;

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
      juice_id: result.recordset[0].juice_id
    });
  } catch (err) {
    console.error("Fejl ved oprettelse af juice:", err);
    res.status(500).json({ error: "Der opstod en fejl ved oprettelse af juicen." });
  }
};
