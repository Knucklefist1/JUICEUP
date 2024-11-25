// juiceController.js
const sql = require("mssql");
const config = require("../Config/Database");
const juiceIngredientController = require("./juiceIngredientController");

// Function to add a new juice
exports.addJuice = async (req, res) => {
  const { name, description, ingredients } = req.body; // Add ingredients to the request body
  const user_id = req.session.userId; // Retrieve the user ID from session

  if (!user_id) {
    return res.status(401).json({ error: "Unauthorized. Please log in to create a juice." });
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
      throw new Error("Failed to create juice");
    }

    const juice_id = result.recordset[0].juice_id;
    console.log("Juice successfully created with ID:", juice_id);

    // Add ingredients to JuiceIngredient table
    for (const ingredient of ingredients) {
      const { ingredient_id, quantity } = ingredient;
      if (!ingredient_id || !quantity) {
        console.error("Invalid ingredient data:", ingredient);
        throw new Error("Invalid ingredient data.");
      }
      await juiceIngredientController.addJuiceIngredient(juice_id, ingredient_id, quantity);
    }

    res.status(201).json({
      message: "Juice created successfully!",
      juice_id: juice_id,
    });
  } catch (err) {
    console.error("Error creating juice:", err);
    res.status(500).json({ error: "An error occurred while creating the juice." });
  }
};


exports.getAllJuices = async (req, res) => {
  try {
    console.log("Connecting to the database...");
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

    console.log("Juices fetched:", result.recordset);

    // Fetch ingredients for each juice separately
    const juices = await Promise.all(result.recordset.map(async (juice) => {
      const ingredientRequest = new sql.Request();
      ingredientRequest.input("juice_id", sql.Int, juice.id);
      const ingredientsResult = await ingredientRequest.query(`
        SELECT i.name, ji.quantity
        FROM JuiceIngredient ji
        JOIN Ingredient i ON ji.ingredient_id = i.ingredient_id
        WHERE ji.juice_id = @juice_id
      `);

      console.log(`Ingredients for juice ${juice.id}:`, ingredientsResult.recordset);

      return {
        ...juice,
        ingredients: ingredientsResult.recordset,
      };
    }));

    console.log("Final juices with ingredients:", juices);
    res.status(200).json(juices);
  } catch (err) {
    console.error("Error fetching juices:", err);
    res.status(500).json({ error: "An error occurred while fetching the juices." });
  }
};
