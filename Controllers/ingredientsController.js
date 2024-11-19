const sql = require("mssql");
const config = require("../Config/Database");

// Function to get all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query(`
      SELECT ingredient_id AS id, name
      FROM Ingredient
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching ingredients:", err);
    res.status(500).json({ error: "An error occurred while fetching ingredients." });
  }
};

// Get ingredient by name
exports.getIngredientByName = async (req, res) => {
  const { name } = req.body;

  try {
      await sql.connect(config);
      const request = new sql.Request();
      request.input("name", sql.VarChar, name);

      const result = await request.query(`
          SELECT ingredient_id FROM Ingredient WHERE name = @name
      `);

      if (result.recordset.length > 0) {
          res.status(200).json({ ingredient_id: result.recordset[0].ingredient_id });
      } else {
          res.status(404).json({ error: "Ingredient not found." });
      }
  } catch (err) {
      console.error("Error fetching ingredient:", err);
      res.status(500).json({ error: "An error occurred while fetching the ingredient." });
  }
};

