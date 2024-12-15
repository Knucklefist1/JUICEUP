const { getUsers, getUserById } = require('../db/queries'); // Importér databaseforespørgsler

// Funktion til at hente alle brugere fra databasen
async function fetchAllUsers() {
  try {
    return await getUsers(); // Kald getUsers-funktionen fra databasen
  } catch (err) {
    console.error('Fejl i fetchAllUsers service-lag:', err); // Log fejl
    throw err; // Kast fejl videre
  }
}

// Funktion til at hente en bruger baseret på deres ID
async function fetchUserById(userId) {
  try {
    return await getUserById(userId); // Kald getUserById-funktionen fra databasen
  } catch (err) {
    console.error(`Fejl i fetchUserById service-lag for userId ${userId}:`, err); // Log fejl med userId
    throw err; // Kast fejl videre
  }
}

// Eksportér funktionerne til brug andre steder i applikationen
module.exports = {
  fetchAllUsers, // Eksportér funktionen til at hente alle brugere
  fetchUserById, // Eksportér funktionen til at hente en bruger baseret på ID
};
