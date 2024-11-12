const sql = require('mssql');

// Konfigurationsindstillinger
const config = {
  user: 'Adminforjuiceapp',
  password: 'JuiceappCBS69',
  server: 'juiceapp123.database.windows.net', // Tilføj '.database.windows.net' til servernavnet
  database: 'JUICEAPPDATABASE',
  options: {
    encrypt: true, // Kryptering påkrævet af Azure
    trustServerCertificate: false, // Brug falsk, medmindre du kører lokalt
  },
};

// Opret forbindelse
async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('Forbundet til databasen!');
  } catch (err) {
    console.error('Fejl ved forbindelse til databasen:', err);
  }
}

connectToDatabase();
