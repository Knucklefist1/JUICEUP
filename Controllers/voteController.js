const sql = require("mssql");
const config = require("../Config/Database"); // Import the database connection

// Function to add a vote
async function addVote(req, res) {
  const { user_id, juice_id } = req.body;

  try {
    // Connect to the database
    await sql.connect(config);
    const request = new sql.Request();

    // Use parameterized queries to prevent SQL injection
    request.input("user_id", sql.Int, user_id);
    request.input("juice_id", sql.Int, juice_id);

    // Insert vote into the database
    await request.query(`
      INSERT INTO Vote (user_id, juice_id, created_at)
      VALUES (@user_id, @juice_id, GETDATE())
    `);

    res.status(201).send("Vote created successfully!");
  } catch (err) {
    console.error("Error creating vote:", err);
    res.status(500).send("An error occurred while creating the vote.");
  }
}

module.exports = { addVote };
