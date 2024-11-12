const sql = require("mssql");
const config = require("../Config/Database"); // Importér din databaseforbindelse

// Funktion til at tilføje en stemme
async function addVote(req, res) {
  const { user_id, juice_id } = req.body;

  try {
    // Opret forbindelse til databasen
    await sql.connect(config);
    const request = new sql.Request();

    // Indsæt stemme i databasen
    await request.query(`
      INSERT INTO Vote (user_id, juice_id, created_at)
      VALUES (${user_id}, ${juice_id}, GETDATE())
    `);

    res.status(201).send("Stemme oprettet succesfuldt!");
  } catch (err) {
    console.error("Fejl ved oprettelse af stemme:", err);
    res.status(500).send("Der opstod en fejl ved oprettelse af stemmen.");
  }
}

module.exports = { addVote };
