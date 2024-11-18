const sql = require("mssql");
const config = require("../Config/Database"); // Import the database connection

// Function to add a juice ingredient
async function addJuiceIngredient(req, res) {
  const { juice_id, ingredient_id, amount } = req.body;
  console.log("Received data for JuiceIngredient:", req.body); // Debug message

  try {
    // Connect to the database
    await sql.connect(config);
    console.log("Connected to the database"); // Debug message

    const request = new sql.Request();

    // Parameterized queries to avoid SQL injection
    request.input("juice_id", sql.Int, juice_id);
    request.input("ingredient_id", sql.Int, ingredient_id);
    request.input("amount", sql.Float, amount);

    // Insert juice ingredient into the database
    await request.query(`
      INSERT INTO JuiceIngredient (juice_id, ingredient_id, amount)
      VALUES (@juice_id, @ingredient_id, @amount)
    `);
    console.log("Data inserted into JuiceIngredient"); // Debug message

    res.status(201).send("Juice ingredient created successfully!");
  } catch (err) {
    console.error("Error creating juice ingredient:", err);
    res.status(500).send("An error occurred while creating the juice ingredient.");
  }
}

module.exports = { addJuiceIngredient };