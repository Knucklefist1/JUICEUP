const sql = require("mssql");
const config = require("../Config/Database"); // Importér din databaseforbindelse

// Funktion til at tilføje en juice-ingrediens
async function addJuiceIngredient(req, res) {
  const { juice_id, ingredient_id, amount } = req.body;
  console.log("Modtog data til JuiceIngredient:", req.body); // Debug-besked

  try {
    // Opret forbindelse til databasen
    await sql.connect(config);
    console.log("Forbundet til databasen"); // Debug-besked

    const request = new sql.Request();

    // Parameteriserede forespørgsler for at undgå SQL-injection
    request.input("juice_id", sql.Int, juice_id);
    request.input("ingredient_id", sql.Int, ingredient_id);
    request.input("amount", sql.Float, amount);

    // Indsæt juice-ingrediens i databasen
    await request.query(`
      INSERT INTO JuiceIngredient (juice_id, ingredient_id, amount)
      VALUES (@juice_id, @ingredient_id, @amount)
    `);
    console.log("Data indsat i JuiceIngredient"); // Debug-besked

    res.status(201).send("Juice-ingrediens oprettet succesfuldt!");
  } catch (err) {
    console.error("Fejl ved oprettelse af juice-ingrediens:", err);
    res.status(500).send("Der opstod en fejl ved oprettelse af juice-ingrediensen.");
  }
}

module.exports = { addJuiceIngredient };
