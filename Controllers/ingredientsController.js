const sql = require("mssql");
const config = require("../Config/Database");

// Funktion til at tilføje en ingrediens
exports.addIngredient = async (req, res) => {
  const { name, quantity } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("name", sql.VarChar, name);
    request.input("quantity", sql.Float, quantity);

    const result = await request.query(`
      INSERT INTO Ingredient (name, quantity)
      OUTPUT INSERTED.ingredient_id
      VALUES (@name, @quantity)
    `);

    res.status(201).json({
      message: "Ingredient added successfully!",
      ingredient_id: result.recordset[0].ingredient_id
    });
  } catch (err) {
    console.error("Fejl ved oprettelse af ingrediens:", err);
    res.status(500).json({ error: "Der opstod en fejl ved oprettelse af ingrediensen." });
  }
};

// Ny funktion til at tjekke, om ingrediensen allerede findes
exports.checkIngredient = async (req, res) => {
  const { name } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("name", sql.VarChar, name);

    const result = await request.query(`
      SELECT * FROM Ingredient WHERE name = @name
    `);

    if (result.recordset.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Fejl ved kontrol af ingrediens:", err);
    res.status(500).json({ error: "Der opstod en fejl ved kontrol af ingrediensen." });
  }
};

// Ny funktion til at opdatere en eksisterende ingrediens
exports.updateIngredient = async (req, res) => {
  const { name, quantity } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("name", sql.VarChar, name);
    request.input("quantity", sql.Float, quantity);

    const result = await request.query(`
      UPDATE Ingredient
      SET quantity = @quantity
      WHERE name = @name
      OUTPUT INSERTED.ingredient_id
    `);

    if (result.recordset.length > 0) {
      res.status(200).json({
        message: "Ingredient updated successfully!",
        ingredient_id: result.recordset[0].ingredient_id
      });
    } else {
      res.status(404).json({ error: "Ingredient not found." });
    }
  } catch (err) {
    console.error("Fejl ved opdatering af ingrediens:", err);
    res.status(500).json({ error: "Der opstod en fejl ved opdatering af ingrediensen." });
  }
};
