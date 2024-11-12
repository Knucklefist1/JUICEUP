const sql = require("mssql");
const config = require("../Config/Database"); // Importér din databaseforbindelse

// Funktion til at tilføje en ny ingrediens
async function addIngredient(req, res) {
  const { name, description } = req.body;

  try {
    // Opret forbindelse til databasen
    await sql.connect(config);
    const request = new sql.Request();

    // Indsæt ingrediensen i databasen
    await request.query(`
      INSERT INTO Ingredient (name, description)
      VALUES ('${name}', '${description}')
    `);

    res.status(201).send("Ingrediens oprettet succesfuldt!");
  } catch (err) {
    console.error("Fejl ved oprettelse af ingrediens:", err);
    res.status(500).send("Der opstod en fejl ved oprettelse af ingrediens.");
  }
}

module.exports = { addIngredient };
