// juiceController.js
const sql = require("mssql");
const config = require("../Config/Database");
const juiceIngredientController = require("./juiceIngredientController");

// Funktion til at tilføje en ny juice
exports.addJuice = async (req, res) => {
  const { name, description, ingredients } = req.body; // Modtager juice og ingredienser fra forespørgsel
  const user_id = req.session.userId; // Henter brugerens ID fra sessionen

  if (!user_id) {
    return res.status(401).json({ error: "Uautoriseret. Log ind for at oprette en juice." });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("user_id", sql.Int, user_id);
    request.input("name", sql.VarChar, name);
    request.input("description", sql.Text, description);

    const result = await request.query(`
      INSERT INTO Juice (user_id, name, description, created_at, votes)
      OUTPUT INSERTED.juice_id
      VALUES (@user_id, @name, @description, GETDATE(), 0)
    `);

    if (result.recordset.length === 0) {
      throw new Error("Kunne ikke oprette juicen.");
    }

    const juice_id = result.recordset[0].juice_id;
    console.log("Juice oprettet med ID:", juice_id);

    // Tilføj ingredienser til JuiceIngredient-tabellen
    for (const ingredient of ingredients) {
      const { ingredient_id, quantity } = ingredient;
      if (!ingredient_id || !quantity) {
        console.error("Ugyldige ingrediensdata:", ingredient);
        throw new Error("Ugyldige ingrediensdata.");
      }
      await juiceIngredientController.addJuiceIngredient(juice_id, ingredient_id, quantity);
    }

    res.status(201).json({
      message: "Juicen blev oprettet!",
      juice_id: juice_id,
    });
  } catch (err) {
    console.error("Fejl ved oprettelse af juice:", err);
    res.status(500).json({ error: "Der opstod en fejl under oprettelse af juicen." });
  }
};

// Funktion til at hente alle juicer
exports.getAllJuices = async (req, res) => {
  try {
    console.log("Forbinder til databasen...");
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query(`
      SELECT 
        j.juice_id AS id, 
        j.name, 
        j.description, 
        j.votes, 
        u.username AS creator
      FROM Juice j
      JOIN Users u ON j.user_id = u.user_id
    `);

    console.log("Juicer hentet:", result.recordset);

    // Hent ingredienser for hver juice
    const juices = await Promise.all(result.recordset.map(async (juice) => {
      const ingredientRequest = new sql.Request();
      ingredientRequest.input("juice_id", sql.Int, juice.id);
      const ingredientsResult = await ingredientRequest.query(`
        SELECT i.name, ji.quantity
        FROM JuiceIngredient ji
        JOIN Ingredient i ON ji.ingredient_id = i.ingredient_id
        WHERE ji.juice_id = @juice_id
      `);

      console.log(`Ingredienser for juice ${juice.id}:`, ingredientsResult.recordset);

      return {
        ...juice,
        ingredients: ingredientsResult.recordset,
      };
    }));

    console.log("Endelige juicer med ingredienser:", juices);
    res.status(200).json(juices);
  } catch (err) {
    console.error("Fejl ved hentning af juicer:", err);
    res.status(500).json({ error: "Der opstod en fejl under hentning af juicerne." });
  }
};
