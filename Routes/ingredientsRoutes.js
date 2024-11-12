// ingredientsRoutes.js
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../Config/Database");

// POST-rute til at oprette en ny ingrediens
router.post("/add", async (req, res) => {
  const { name, description } = req.body;
  console.log("Modtog data for at oprette ingrediens:", req.body);

  try {
    // Opret forbindelse til databasen
    await sql.connect(config);
    console.log("Forbundet til databasen");

    const request = new sql.Request();
    request.input("name", sql.VarChar, name);
    request.input("description", sql.Text, description);

    // Indsæt ingrediens i Ingredient-tabellen
    await request.query(`
      INSERT INTO Ingredient (name, description)
      VALUES (@name, @description)
    `);
    console.log("Ingrediens oprettet succesfuldt");

    res.status(201).send("Ingrediens oprettet succesfuldt!");
  } catch (err) {
    console.error("Fejl ved oprettelse af ingrediens:", err);
    res.status(500).send("Der opstod en fejl ved oprettelse af ingrediensen.");
  }
});

module.exports = router;
