const cloudinary = require('cloudinary').v2;
const { cloudinaryApiKey, cloudinarySecret, cloudinaryCloudName, nodeEnv } = require('./envConfig'); // Importer miljøvariabler

// Konfigurer Cloudinary
cloudinary.config({
  cloud_name: cloudinaryCloudName, // Cloudinary cloud-navn
  api_key: cloudinaryApiKey, // API-nøgle
  api_secret: cloudinarySecret, // API-hemmelighed
});

// Log konfiguration til fejlsøgning (kun i udviklingsmiljø)
if (nodeEnv !== 'production') {
  console.log('Cloudinary konfigureret korrekt'); // Debug-log
}

module.exports = cloudinary;
