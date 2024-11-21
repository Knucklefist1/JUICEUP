const cloudinary = require('cloudinary').v2;
const { cloudinaryApiKey, cloudinarySecret, cloudinaryCloudName } = require('./envConfig'); // Importér miljøvariabler

// Konfigurer Cloudinary
cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinarySecret,
});

// Log konfigurationen for fejlfinding
console.log('Cloudinary configured:', {
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinarySecret,
});

module.exports = cloudinary;
