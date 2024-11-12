const { getUsers, getUserById } = require('../db/queries');

async function fetchAllUsers() {
  try {
    return await getUsers();
  } catch (err) {
    console.error('Fejl i service lag:', err);
    throw err;
  }
}

async function fetchUserById(userId) {
  try {
    return await getUserById(userId);
  } catch (err) {
    console.error('Fejl i service lag:', err);
    throw err;
  }
}

module.exports = {
  fetchAllUsers,
  fetchUserById,
};
