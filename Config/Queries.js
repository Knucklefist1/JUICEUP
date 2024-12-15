const getDbConnection = require('./Database');
// Hent alle brugere fra databasen
async function getUsers() {
  try {
    const pool = await getDbConnection(); // Opret forbindelse til databasen
    const result = await pool.request().query('SELECT * FROM Users'); // Udfør forespørgsel
    return result.recordset; // Returner resultatet som en liste af brugere
  } catch (err) {
    console.error('Fejl ved hentning af brugere:', err); // Log fejl
    throw err; // Kast fejl videre
  }
}

// Hent en bruger baseret på bruger-ID
async function getUserById(userId) {
  try {
    const pool = await getDbConnection(); // Opret forbindelse til databasen
    const result = await pool.request()
      .input('userId', sql.Int, userId) // Tilføj parameter til forespørgslen
      .query('SELECT * FROM Users WHERE Id = @userId'); // Udfør forespørgsel
    return result.recordset[0]; // Returner den fundne bruger eller null
  } catch (err) {
    console.error('Fejl ved hentning af bruger:', err); // Log fejl
    throw err; // Kast fejl videre
  }
}

module.exports = {
  getUsers, // Eksportér funktion til at hente alle brugere
  getUserById, // Eksportér funktion til at hente en bruger baseret på ID
};