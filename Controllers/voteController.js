const sql = require("mssql");
const config = require("../Config/Database"); // Import the database connection

// Function to add a vote
async function addVote(req, res) {
  const juice_id = req.body.juice_id;
  const user_id = req.session.userId; // Get user ID from session

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in to vote." });
  }

  try {
    // Connect to the database
    await sql.connect(config);
    const request = new sql.Request();

    // Check if the user has already voted for this juice
    request.input("user_id", sql.Int, user_id);
    request.input("juice_id", sql.Int, juice_id);
    const existingVote = await request.query(`
      SELECT * FROM Vote WHERE user_id = @user_id AND juice_id = @juice_id
    `);

    if (existingVote.recordset.length > 0) {
      return res.status(400).json({ error: "You have already voted for this juice." });
    }

    // Insert vote into the database
    await request.query(`
      INSERT INTO Vote (user_id, juice_id, created_at)
      VALUES (@user_id, @juice_id, GETDATE())
    `);

    // Update vote count in Juice table
    const updatedVoteCount = await request.query(`
      UPDATE Juice 
      SET votes = votes + 1 
      OUTPUT inserted.votes 
      WHERE juice_id = @juice_id
    `);

    if (updatedVoteCount.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Juice not found" });
    }

    res.status(201).json({ updatedVotes: updatedVoteCount.recordset[0].votes });
  } catch (err) {
    console.error("Error creating vote:", err);
    res.status(500).json({ error: "An error occurred while creating the vote." });
  }
}

module.exports = { addVote };
