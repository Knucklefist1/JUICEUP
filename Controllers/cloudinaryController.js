const cloudinary = require('../Config/cloudinaryConfig');
console.log('Cloudinary configuration:', cloudinary.config());

// Public IDs for images
const publicIds = [
  'Joe billeder/pjumv7w5ow9r7j4ssiqv', // Store
  'Joe billeder/chcdnyn6fsg4ehinjmj9', // Logo
  'Joe billeder/axlz7045mfazvbl4qapv', // Juice cup
];

// Function to fetch URLs for images
const listImages = async () => {
  try {
    // Generate secure URLs for each image in Cloudinary
    const imageUrls = publicIds.map((id) =>
      cloudinary.url(id, { secure: true }) // Always use secure HTTPS URLs
    );

    console.log('Generated image URLs:', imageUrls); // Debug log
    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Export the listImages function for use in your application
module.exports = { listImages };
