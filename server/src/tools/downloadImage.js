const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

//config
const targetSize = 512;
const outputDir = path.join(__dirname, '../assets/images/products');


const downloadImage = (name, filepath) => {
  const fileName = name + '.jpg';
  const outputPath = path.join(outputDir, fileName);

  try {

    sharp(filepath)
    .resize(targetSize, targetSize, {
      fit: 'cover'
    })
    .jpeg({quality: 80})
    .toFile(outputPath)
    console.log(`✔ Saved ${fileName}`);
    return '/images/products/' + fileName;
  }
  catch(err){
    console.error(`✖ Failed ${fileName}:`, err.message);
  }

}

module.exports = {
  downloadImage
};