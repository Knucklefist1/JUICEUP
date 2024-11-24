const sql = require('mssql');
const {
  dbUser,
  dbPassword,
  dbServer,
  dbName,
  dbEncrypt,
  dbTrustServerCertificate,
} = require('./envConfig'); // Import environment variables from envConfig.js

// Configuration settings
const config = {
  user: dbUser,
  password: dbPassword,
  server: dbServer,
  database: dbName,
  options: {
    encrypt: dbEncrypt, // Required by Azure
    trustServerCertificate: dbTrustServerCertificate, // Use false unless running locally
  },
};

// Connect to the database
async function connectToDatabase() {
  try {
    console.log('Database configuration:', config); // Log config for debugging
    await sql.connect(config);
    console.log('Connected to the database!');
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err; // Re-throw error so that calling code knows the connection failed
  }
}

module.exports = {
  connectToDatabase,
  sql // Export the sql module for making queries
};
