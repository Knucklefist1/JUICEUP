const getDbConnection = require('./dbConnection');

async function getUsers() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
  } catch (err) {
    console.error('Fejl ved hentning af brugere:', err);
    throw err;
  }
}

async function getUserById(userId) {
  try {
    const pool = await getDbConnection();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Users WHERE Id = @userId');
    return result.recordset[0];
  } catch (err) {
    console.error('Fejl ved hentning af bruger:', err);
    throw err;
  }
}

module.exports = {
  getUsers,
  getUserById,
};
