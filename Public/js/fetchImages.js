fetch('/api/cloudinary/list-images')
  .then((response) => response.json())
  .then((data) => {
    console.log('Fetched image data:', data); // Debug-log
    const imageContainer = document.getElementById('image-container');
    if (!imageContainer) {
      console.error('Container for billeder (#image-container) blev ikke fundet.');
      return;
    }
    data.images.forEach((url, index) => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Cloudinary image ${index + 1}`;
      img.style.width = '200px';
      img.style.margin = '10px';
      imageContainer.appendChild(img);
    });
  })
  .catch((error) => console.error('Error fetching images:', error));
