const sql = require("mssql");
const config = require("../Config/Database");

// Funktion til at hente alle ingredienser
exports.getAllIngredients = async (req, res) => {
  try {
    // Opret forbindelse til databasen med sikker konfiguration
    await sql.connect(config);
    const request = new sql.Request();

    // SQL-query for at hente alle ingredienser fra Ingredient-tabellen
    const result = await request.query(`
      SELECT ingredient_id AS id, name
      FROM Ingredient
    `);

    res.status(200).json(result.recordset); // Returnerer ingredienserne som JSON
  } catch (err) {
    console.error("Fejl ved hentning af ingredienser:", err);
    res.status(500).json({ error: "Der opstod en fejl under hentning af ingredienser." });
  }
};

// Funktion til at hente en ingrediens ud fra navn
exports.getIngredientByName = async (req, res) => {
  const { name } = req.body;

  // Sikrer at parameteren 'name' er angivet
  if (!name) {
    return res.status(400).json({ error: "Ingrediensens navn er påkrævet." });
  }

  try {
    // Opret forbindelse til databasen med sikker konfiguration
    await sql.connect(config);
    const request = new sql.Request();
    request.input("name", sql.VarChar, name);

    // SQL-query for at hente en ingrediens ud fra dens navn
    const result = await request.query(`
      SELECT ingredient_id 
      FROM Ingredient 
      WHERE name = @name
    `);

    if (result.recordset.length > 0) {
      res.status(200).json({ ingredient_id: result.recordset[0].ingredient_id }); // Returnerer ingrediensens ID
    } else {
      res.status(404).json({ error: "Ingrediensen blev ikke fundet." });
    }
  } catch (err) {
    console.error("Fejl ved hentning af ingrediens:", err);
    res.status(500).json({ error: "Der opstod en fejl under hentning af ingrediensen." });
  }
};
