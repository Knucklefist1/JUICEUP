const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dpvb3iuu7", // cloud_name
  api_key: "345322197213485", // api_key
  api_secret: "Fkh0gQaYt804fJymtA09SzwL_D8", // api_secret
  secure: true,
});

async function upload(file) {
  const uploadOptions = {
    public_id: "cdn-example/" + file.split(".")[0],
    resource_type: "auto",
  };
  try {
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// Øvelse 1 - Upload et billede og en video til Cloudinary
// Lav ´npm install´ for at installere dependencies
// Log in en bruger på Cloudinary og find cloud_name, api_key og api_secret
// Kald funktionen upload() med filnavne "cbs.jpeg" og "cbs.mp4" som argument
// Kig i console.log for at finde URL for uploadede filer