const sql = require("mssql");
const config = require("../Config/Database"); // Importér din databaseforbindelse

// Funktion til at tilføje en ny juice
async function addJuice(req, res) {
  const { user_id, name, description } = req.body;

  try {
    // Opret forbindelse til databasen
    await sql.connect(config);
    const request = new sql.Request();

    // Indsæt juicen i databasen
    await request.query(`
      INSERT INTO Juice (user_id, name, description, created_at, votes)
      VALUES (${user_id}, '${name}', '${description}', GETDATE(), 0)
    `);

    res.status(201).send("Juice oprettet succesfuldt!");
  } catch (err) {
    console.error("Fejl ved oprettelse af juice:", err);
    res.status(500).send("Der opstod en fejl ved oprettelse af juicen.");
  }
}

module.exports = { addJuice };
