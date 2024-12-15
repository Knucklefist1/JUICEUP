const express = require('express');
const router = express.Router();
const { listImages } = require('../Controllers/cloudinaryController');

// Route til at hente billeder fra Cloudinary
router.get('/list-images', async (req, res) => {
  try {
    const imageUrls = await listImages(); // Henter billed-URLs via controller
    res.json({ images: imageUrls }); // Returnerer billeder i JSON-format
  } catch (error) {
    console.error('Fejl under hentning af billeder:', error); // Logger fejl til konsollen
    res.status(500).json({ error: 'Kunne ikke hente billeder' }); // Returnerer en fejlmeddelelse
  }
});

// Eksporterer routeren til brug i andre filer
module.exports = router;
