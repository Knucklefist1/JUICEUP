const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const path = require("path");
const session = require('express-session')

const app = express();
const config = require("./Config/Database"); // Brug din databasekonfigurationsfil

// CORS-konfiguration
const corsOptions = {
  origin: "http://127.0.0.1:5502",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(session({
  secret: '123', // Replace with a secure secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cors(corsOptions));
app.use(express.json());



// Server statiske frontend-filer
app.use(express.static(path.join(__dirname, 'Public')));

// Import routes
const apiRoutes = require("./Routes/APIroutes");
const userRoutes = require("./Routes/userRoutes");
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
app.use("/", userRoutes);

// Catch-all route for client-side routing (hvis du bruger React-router eller lignende)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Forbind til database og start serveren
sql.connect(config)
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
