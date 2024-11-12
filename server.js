const express = require("express");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

sql.connect(config)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection failed:", err));

app.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.send("Server is working!");
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received data:", req.body);

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password hashed");

    await sql.connect(config);
    console.log("Connected to the database for sign-up");

    const request = new sql.Request();
    await request.query(`
      INSERT INTO Users (username, email, password_hash, created_at)
      VALUES ('${username}', '${email}', '${hashedPassword}', GETDATE())
    `);
    console.log("User data inserted into the database");

    res.status(201).send("User created successfully!");
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).send("An error occurred during user creation.");
  }
});

app.get("/api/juice/getAll", async (req, res) => {
  try {
    await sql.connect(config);
    console.log("Connected to the database for fetching juices");

    const request = new sql.Request();
    const juiceQuery = `
      SELECT J.juice_id, J.name, J.votes, U.username AS creator
      FROM Juice J
      JOIN Users U ON J.user_id = U.user_id;
    `;
    const juiceResult = await request.query(juiceQuery);

    const juices = await Promise.all(
      juiceResult.recordset.map(async (juice) => {
        const ingredientRequest = new sql.Request();
        const ingredientQuery = `
          SELECT I.name, JI.quantity
          FROM JuiceIngredient JI
          JOIN Ingredient I ON JI.ingredient_id = I.ingredient_id
          WHERE JI.juice_id = @juice_id;
        `;
        ingredientRequest.input("juice_id", sql.Int, juice.juice_id);
        const ingredientResult = await ingredientRequest.query(ingredientQuery);
        
        return {
          id: juice.juice_id,
          name: juice.name,
          creator: juice.creator,
          votes: juice.votes,
          ingredients: ingredientResult.recordset
        };
      })
    );

    console.log("Juice data with ingredients retrieved successfully");
    res.json(juices);
  } catch (err) {
    console.error("Error fetching juices:", err);
    res.status(500).send("Error retrieving juices from the database.");
  }
});

app.post("/api/juice/add", async (req, res) => {
  const { user_id, name, description } = req.body;
  console.log("Received data to create juice:", req.body);

  try {
    await sql.connect(config);
    console.log("Connected to the database for creating juice");

    const request = new sql.Request();
    request.input("user_id", sql.Int, user_id);
    request.input("name", sql.VarChar, name);
    request.input("description", sql.Text, description);

    const result = await request.query(`
      INSERT INTO Juice (user_id, name, description, created_at, votes)
      OUTPUT INSERTED.juice_id
      VALUES (@user_id, @name, @description, GETDATE(), 0)
    `);

    console.log("Juice created successfully, juice_id:", result.recordset[0].juice_id);

    res.status(201).json({
      message: "Juice created successfully!",
      juice_id: result.recordset[0].juice_id,
    });
  } catch (err) {
    console.error("Error creating juice:", err);
    res.status(500).send("An error occurred while creating the juice.");
  }
});

// Use `quantity` consistently in this route
app.post("/api/ingredient/add", async (req, res) => {
  const { name, quantity } = req.body;
  console.log("Received data to add ingredient:", req.body);

  try {
    await sql.connect(config);
    console.log("Connected to the database for adding ingredient");

    const request = new sql.Request();
    request.input("name", sql.VarChar, name);
    request.input("quantity", sql.Float, quantity);

    const result = await request.query(`
      INSERT INTO Ingredient (name, quantity)
      OUTPUT INSERTED.ingredient_id
      VALUES (@name, @quantity)
    `);

    console.log("Ingredient added successfully, ingredient_id:", result.recordset[0].ingredient_id);

    res.status(201).json({
      message: "Ingredient added successfully!",
      ingredient_id: result.recordset[0].ingredient_id,
    });
  } catch (err) {
    console.error("Error adding ingredient:", err);
    res.status(500).json({ error: `An error occurred while adding the ingredient: ${err.message}` });
  }
});

app.post("/api/juice/vote/:id", async (req, res) => {
  const juiceId = req.params.id;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input("juice_id", sql.Int, juiceId);

    const result = await request.query(`
      UPDATE Juice SET votes = votes + 1 WHERE juice_id = @juice_id;
      SELECT votes FROM Juice WHERE juice_id = @juice_id;
    `);

    const updatedVotes = result.recordset[0].votes;
    res.json({ votes: updatedVotes });
  } catch (err) {
    console.error("Error voting for juice:", err);
    res.status(500).send("An error occurred while voting.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
