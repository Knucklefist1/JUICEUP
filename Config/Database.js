const sql = require('mssql');
const {
  dbUser,
  dbPassword,
  dbServer,
  dbName,
  dbEncrypt,
  dbTrustServerCertificate,
  nodeEnv
} = require('./envConfig'); // Importer miljøvariabler fra envConfig.js

// Konfigurationsindstillinger
const config = {
  user: dbUser, // Databasebrugernavn
  password: dbPassword, // Databaseadgangskode
  server: dbServer, // Serveradresse
  database: dbName, // Databasenavn
  options: {
    encrypt: dbEncrypt, // Påkrævet af Azure
    trustServerCertificate: dbTrustServerCertificate, // Brug false medmindre lokalt miljø
  },
};

// Funktion til at oprette forbindelse til databasen
async function connectToDatabase() {
  try {
    if (nodeEnv !== 'production') {
      console.log('Databaseforbindelseskonfiguration:', {
        user: config.user,
        server: config.server,
        database: config.database,
        options: config.options
      }); // Log delvis konfiguration til fejlsøgning
    }
    await sql.connect(config);
    console.log('Forbundet til databasen!');
  } catch (err) {
    console.error('Databaseforbindelse mislykkedes:', err); // Fejllog
    throw err; // Kaster fejl videre, så kaldende kode er klar over fejlen
  }
}

module.exports = {
  connectToDatabase, // Eksporterer funktion til at oprette forbindelse
  sql // Eksporterer sql-modulet til forespørgsler
};
