const { getUsers, getUserById } = require('../db/queries');

// Function to fetch all users from the database
async function fetchAllUsers() {
  try {
    return await getUsers();
  } catch (err) {
    console.error('Error in fetchAllUsers service layer:', err);
    throw err;
  }
}

// Function to fetch a user by their ID
async function fetchUserById(userId) {
  try {
    return await getUserById(userId);
  } catch (err) {
    console.error(`Error in fetchUserById service layer for userId ${userId}:`, err);
    throw err;
  }
}

// Export the functions for use in other parts of the application
module.exports = {
  fetchAllUsers,
  fetchUserById,
};
