const cloudinary = require('cloudinary').v2;
const { cloudinaryApiKey, cloudinarySecret, cloudinaryCloudName, nodeEnv } = require('./envConfig'); // Import environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinarySecret,
});

// Log configuration for troubleshooting (Only in development environment)
if (nodeEnv !== 'production') {
  console.log('Cloudinary configured successfully');
}

module.exports = cloudinary;
