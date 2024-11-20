const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dpvb3iuu7',
  api_key: '345322197213485',
  api_secret: 'Fkh0gQaYt804fJymtA09SzwL_D8',
});

console.log('Cloudinary configured:', cloudinary.config());
module.exports = cloudinary;
