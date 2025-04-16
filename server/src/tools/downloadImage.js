const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

//config
const targetSize = 512;
const outputDir = path.join(__dirname, 'test');

export const downloadImage = (buffer, name) => {

  const fileName = name.toLowerCase().replace(/\s+/g, '_') + '.jpg';
  const outputPath = path.join(outputDir, fileName);


  try {
    sharp(buffer)
    .resize(targetSize, targetSize, {
      fit: 'cover,'
    })
    .jpeg({quality: 80})
    .toFile(outputDir)
    console.log(`✔ Saved ${newFilename}`);
  }
  catch(err){
    console.error(`✖ Failed ${filename}:`, err.message);
  }
  reader.onerror = (error) => {
    console.error("FileReader Error:", error);
  }
}


