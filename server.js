require('dotenv').config();
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const path = require("path");
const { connectToDatabase } = require('./Config/Database'); // Central databaseforbindelse
const ensureAuthenticated = require('./Middleware/middleware'); 
const cloudinaryRoutes = require('./Routes/cloudinaryRoutes');

const app = express();

// Bestem om miljøet er produktion eller udvikling
const isProduction = process.env.NODE_ENV === 'production';

// Server URL afhængigt af miljø
const BASE_URL = isProduction ? 'https://www.joejuicecompetition.live' : 'http://localhost';

// Middleware til sessionhåndtering
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: {
    httpOnly: true, // Blokerer adgang via JavaScript
    secure: isProduction, // Kun HTTPS i produktion
    sameSite: 'Lax', // Juster til 'None', hvis cookies skal sendes på tværs af domæner
    maxAge: 1000 * 60 * 30 // 30 minutter
  }
}));

// CORS-konfiguration for flere oprindelser
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.joejuicecompetition.live',
  'https://joejuicecompetition.live'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Tillader cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Route til at omdirigere til login eller en specifik forside
app.get('/', (req, res) => {
  res.redirect('/juiceApp.html');
});

// Ruter til statiske sider
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'login.html'));
});

app.get('/createNow.html', ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'createNow.html'));
});

// Middleware til autentifikation
app.use((req, res, next) => {
  const openPaths = [
    '/', '/login', '/signup', '/check-session', '/login.html', 
    '/signup.html', '/logout', '/api/juice/getAll', '/api/cloudinary/list-images'
  ];
  if (openPaths.includes(req.path) || req.path.startsWith('/Public')) {
    return next();
  }
  return ensureAuthenticated(req, res, next);
});

// Importér og brug ruter
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
app.use("/api", voteRoutes);
app.use("/", userRoutes);
app.use("/api/juice", juiceRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

// Route til at tjekke sessionstatus
app.get('/check-session', (req, res) => {
  if (req.session.userId) {
    console.log(`User is logged in with ID: ${req.session.userId}`);
    res.status(200).json({ isLoggedIn: true, userId: req.session.userId });
  } else {
    console.log('No user is logged in');
    res.status(200).json({ isLoggedIn: false });
  }
});

// Tilslutning til databasen og opstart af serveren
connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to start server due to database connection error:", err);
  });

// Route til logout
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

// Tving HTTPS i produktion
if (isProduction) {
  app.use((req, res, next) => {
    if (!req.secure && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}
