const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
const config = require("./Config/Database"); // Brug din databasekonfigurationsfil

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const apiRoutes = require("./Routes/APIroutes");
const userRoutes = require("./Routes/userRoutes"); // Importer userRoutes
const ingredientsRoutes = require("./Routes/ingredientsRoutes");
const juiceIngredientRoutes = require("./Routes/juiceIngredientRoutes");
const juiceRoutes = require("./Routes/juiceRoutes");
const voteRoutes = require("./Routes/voteRoutes");

// Brug de importerede routes
app.use("/", apiRoutes);
app.use("/", ingredientsRoutes);
app.use("/", juiceIngredientRoutes);
app.use("/", juiceRoutes);
app.use("/", voteRoutes);
app.use("/", userRoutes); // Tilføj route til din Express-app

// Forbind til database og start serveren
sql.connect(config)
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
