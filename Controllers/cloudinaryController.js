const cloudinary = require('../Config/cloudinaryConfig');
console.log('Cloudinary configuration:', cloudinary.config());

// Public IDs for billeder
const publicIds = [
  'Joe billeder/pjumv7w5ow9r7j4ssiqv', //Butik
  'Joe billeder/chcdnyn6fsg4ehinjmj9', //Logo
  'Joe billeder/axlz7045mfazvbl4qapv', //juicekop
];

// Funktion til at hente URL'er for billeder
const listImages = async () => {
  try {
    const imageUrls = publicIds.map((id) =>
      cloudinary.url(id, { secure: true })
    );
    console.log('Generated image URLs:', imageUrls); // Debug-log
    return imageUrls;
  } catch (error) {
    console.error('Fejl under hentning af billeder:', error);
    throw error;
  }
};

module.exports = { listImages };
