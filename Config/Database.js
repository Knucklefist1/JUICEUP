const sql = require('mssql');
const {
  dbUser,
  dbPassword,
  dbServer,
  dbName,
  dbEncrypt,
  dbTrustServerCertificate,
} = require('./envConfig'); // Importér miljøvariabler fra envConfig.js

// Konfigurationsindstillinger
const config = {
  user: dbUser,
  password: dbPassword,
  server: dbServer,
  database: dbName,
  options: {
    encrypt: dbEncrypt, // Kryptering påkrævet af Azure
    trustServerCertificate: dbTrustServerCertificate, // Brug falsk, medmindre du kører lokalt
  },
};

// Opret forbindelse til databasen
async function connectToDatabase() {
  try {
    console.log('Database-konfiguration:', config); // Log konfiguration for fejlfinding
    await sql.connect(config);
    console.log('Forbundet til databasen!');
  } catch (err) {
    console.error('Fejl ved forbindelse til databasen:', err);
  }
}

connectToDatabase();

module.exports = connectToDatabase;
