const express = require("express");
const session = require('express-session');
const sql = require("mssql");
const cors = require("cors");
const path = require("path");
const config = require("./Config/Database");
const ensureAuthenticated = require('./Middleware/middleware'); // Import middleware
const app = express();

// Session middleware
app.use(session({
  secret: 'Karloogkosmo123:', // Replace with your secure secret key
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid', // Set cookie name explicitly
  cookie: {
      httpOnly: true,
      secure: false,
      path: '/',
      maxAge: 1000 * 60 * 30
  }
}));

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Allow cookies to be sent
};
app.use(cors(corsOptions));

app.use(express.json());

app.get('/createNow.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'createNow.html'));
});

// Serve static frontend files, except sensitive ones like createNow.html
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to apply ensureAuthenticated globally except for specific open routes
app.use((req, res, next) => {
  const openPaths = ['/', '/login', '/signup', '/check-session', '/login.html', '/signup.html', '/logout', '/api/juice/getAll'];

  if (openPaths.includes(req.path) || req.path.startsWith('/public')) {
    return next();
  }

  return ensureAuthenticated(req, res, next);
});

// Import routes
const apiRoutes = require("./Routes/APIroutes");
const userRoutes = require("./Routes/userRoutes");
const ingredientsRoutes = require("./Routes/ingredientsRoutes");
const juiceIngredientRoutes = require("./Routes/juiceIngredientRoutes");
const juiceRoutes = require("./Routes/juiceRoutes");
const voteRoutes = require("./Routes/voteRoutes");

// Use imported routes
app.use("/", apiRoutes);
app.use("/", ingredientsRoutes);
app.use("/", juiceIngredientRoutes);
app.use("/", juiceRoutes);
app.use("/", voteRoutes);
app.use("/", userRoutes);
app.use("/api/juice", juiceRoutes);


// Check session route
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    res.status(200).send(`User is logged in with ID: ${req.session.userId}`);
  } else {
    res.status(401).send('No user is logged in');
  }
});

// Connect to the database and start the server
sql.connect(config)
  .then(() => {
    console.log("Connected to the database");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Logout failed.' });
    }
    
    // Clear the session cookie to complete the logout process
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).send('Logged out successfully');
  });
});
