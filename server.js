// server.js

require('dotenv').config();
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const path = require("path");
const { connectToDatabase } = require('./Config/Database'); // Use the centralized database connection
const ensureAuthenticated = require('./Middleware/middleware'); 
const cloudinaryRoutes = require('./Routes/cloudinaryRoutes');

const app = express();

// Determine if we're running in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Set the server URL based on the environment
const BASE_URL = isProduction ? 'http://164.92.247.82' : 'http://localhost';

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: {
    httpOnly: true,
    secure: isProduction,
    path: '/',
    maxAge: 1000 * 60 * 30
  }
}));

// CORS configuration - Adjusted to allow multiple origins
const allowedOrigins = ['http://localhost:3000', 'http://164.92.247.82:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Routes setup
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'login.html'));
});

app.get('/createNow.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'createNow.html'));
});

// Middleware for authentication checks
app.use((req, res, next) => {
  const openPaths = ['/', '/login', '/signup', '/check-session', '/login.html', '/signup.html', '/logout', '/api/juice/getAll', '/api/cloudinary/list-images'];
  if (openPaths.includes(req.path) || req.path.startsWith('/Public')) {
    return next();
  }
  return ensureAuthenticated(req, res, next);
});

// Import and use routes
const apiRoutes = require("./Routes/APIroutes");
const userRoutes = require("./Routes/userRoutes");
const ingredientsRoutes = require("./Routes/ingredientsRoutes");
const juiceIngredientRoutes = require("./Routes/juiceIngredientRoutes");
const juiceRoutes = require("./Routes/juiceRoutes");
const voteRoutes = require("./Routes/voteRoutes");

app.use("/", apiRoutes);
app.use("/", ingredientsRoutes);
app.use("/", juiceIngredientRoutes);
app.use("/", juiceRoutes);
app.use("/", voteRoutes);
app.use("/", userRoutes);
app.use("/api/juice", juiceRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

// Check session route
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    console.log(`User is logged in with ID: ${req.session.userId}`);
    res.status(200).json({ isLoggedIn: true, userId: req.session.userId });
  } else {
    console.log('No user is logged in');
    res.status(200).json({ isLoggedIn: false });
  }
});

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server due to database connection error:", err);
  });

// Logout route
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Logout failed.' });
    }
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).send('Logged out successfully');
  });
});
