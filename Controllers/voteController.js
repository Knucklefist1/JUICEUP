const sql = require("mssql");
const config = require("../Config/Database"); // Importer databasekonfigurationen

// Funktion til at tilføje en stemme
async function addVote(req, res) {
  const juice_id = req.body.juice_id; // Juice ID fra klientens anmodning
  const user_id = req.session.userId; // Hent bruger ID fra sessionen

  if (!user_id) {
    console.log("Uautoriseret forespørgsel. Bruger-ID mangler."); // Debugging
    return res.status(401).json({ error: "Uautoriseret. Log venligst ind for at stemme." });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();

    console.log("Tjekker om brugeren allerede har stemt:", { user_id, juice_id }); // Debugging

    // Tjek om brugeren allerede har stemt på denne juice
    request.input("user_id", sql.Int, user_id);
    request.input("juice_id", sql.Int, juice_id);
    const existingVote = await request.query(`
      SELECT * FROM Vote WHERE user_id = @user_id AND juice_id = @juice_id
    `);

    if (existingVote.recordset.length > 0) {
      console.log("Brugeren har allerede stemt:", existingVote.recordset); // Debugging
      return res.status(400).json({ error: "Du har allerede stemt på denne juice." });
    }

    // Indsæt stemme i Vote-tabellen
    await request.query(`
      INSERT INTO Vote (user_id, juice_id, created_at)
      VALUES (@user_id, @juice_id, GETDATE())
    `);

    // Opdater stemmetællingen i Juice-tabellen
    const updatedVoteCount = await request.query(`
      UPDATE Juice 
      SET votes = votes + 1 
      OUTPUT inserted.votes 
      WHERE juice_id = @juice_id
    `);

    if (updatedVoteCount.rowsAffected[0] === 0) {
      console.log("Juice blev ikke fundet til afstemning."); // Debugging
      return res.status(404).json({ error: "Juice blev ikke fundet" });
    }

    res.status(201).json({ updatedVotes: updatedVoteCount.recordset[0].votes });
  } catch (err) {
    console.error("Fejl under oprettelse af stemme:", err); // Debugging
    res.status(500).json({ error: "Der opstod en fejl under oprettelse af stemme." });
  }
}

module.exports = { addVote };
