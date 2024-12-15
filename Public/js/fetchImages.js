fetch('/api/cloudinary/list-images')
  .then((response) => response.json())
  .then((data) => {
    console.log('Hentede billeddata:', data); // Debug-log
    const imageContainer = document.getElementById('image-container');
    if (!imageContainer) {
      console.error('Container til billeder (#image-container) blev ikke fundet.');
      return;
    }
    data.images.forEach((url, index) => {
      const img = document.createElement('img');
      img.src = url; // Sætter billedets kilde
      img.alt = `Cloudinary image ${index + 1}`; // Tilføjer en beskrivende alt-tekst
      img.style.width = '200px'; // Angiver bredden på billedet
      img.style.margin = '10px'; // Tilføjer margin til billedet
      imageContainer.appendChild(img); // Tilføjer billedet til containeren
    });
  })
  .catch((error) => console.error('Fejl ved hentning af billeder:', error)); // Logger fejl, hvis noget går galt
