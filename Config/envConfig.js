console.log('Miljøvariabler:', process.env);

const dotenv = require('dotenv');
dotenv.config(); // Indlæs miljøvariabler fra .env

module.exports = {
  // Server
  port: process.env.PORT || 3000,
  
  // Database
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbServer: process.env.DB_SERVER,
  dbName: process.env.DB_NAME,
  dbEncrypt: process.env.DB_ENCRYPT === 'true', // Konverter string til boolean
  dbTrustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true', // Konverter string til boolean
  
  // Cloudinary
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
};
