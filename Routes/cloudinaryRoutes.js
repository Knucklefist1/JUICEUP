const express = require('express');
const router = express.Router();
const { listImages } = require('../Controllers/cloudinaryController');

// Route til at hente billeder
router.get('/list-images', async (req, res) => {
  try {
    const imageUrls = await listImages();
    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Fejl under hentning af billeder:', error);
    res.status(500).json({ error: 'Kunne ikke hente billeder' });
  }
});

module.exports = router;
