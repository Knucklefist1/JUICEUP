const cloudinary = require('../Config/cloudinaryConfig');
console.log('Cloudinary configuration:', cloudinary.config()); // Debug: Logger Cloudinary-konfiguration

// Public IDs for billeder
const publicIds = [
  'Joe billeder/pjumv7w5ow9r7j4ssiqv', // Butik
  'Joe billeder/chcdnyn6fsg4ehinjmj9', // Logo
  'Joe billeder/axlz7045mfazvbl4qapv', // Juicekop
];

// Funktion til at hente URLs for billeder
const listImages = async () => {
  try {
    // Genererer sikre URLs for hvert billede i Cloudinary
    const imageUrls = publicIds.map((id) =>
      cloudinary.url(id, { secure: true }) // Bruger altid sikre HTTPS-URLs
    );

    console.log('Generated image URLs:', imageUrls); // Debug: Logger genererede billed-URLs
    return imageUrls;
  } catch (error) {
    console.error('Fejl ved hentning af billeder:', error); // Logger fejl
    throw error; // Smider fejlen videre
  }
};

// Eksporterer listImages-funktionen til brug i applikationen
module.exports = { listImages };
