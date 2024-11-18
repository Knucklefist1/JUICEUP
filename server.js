
const express = require("express");
const session = require('express-session');
const sql = require("mssql");
const cors = require("cors");
const path = require("path");
const config = require("./Config/Database"); // Brug din databasekonfigurationsfil
const app = express();

app.use(session({
  secret: 'Your_Secure_Secret_Key', // Replace with your secure secret key
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid', // Set cookie name explicitly
  cookie: {
      httpOnly: true, // Cookie is accessible only through HTTP (not JavaScript)
      secure: false,  // Set to true if using HTTPS
      path: '/',      // This ensures the cookie is available throughout the entire domain
      maxAge: 1000 * 60 * 30 // Optional: cookie expires in 30 minutes
  }
}));


// CORS-konfiguration
const corsOptions = {
  origin: "http://localhost:3000", // eller brug din frontend-url
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Tillader cookies at blive sendt
};
app.use(cors(corsOptions));

app.use(express.json());

// Server statiske frontend-filer
app.use(express.static(path.join(__dirname, 'public')));


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

// Check session route
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.status(200).send(`User is logged in with ID: ${req.session.userId}`);
  } else {
    res.status(401).send('No user is logged in');
  }
});

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
