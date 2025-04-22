const { rename } = require('fs');
const path = require('path');
const sharp = require('sharp');
const fsPromises = require('fs').promises;
//config
const targetSize = 512;
const outputDir = path.join(__dirname, '../assets/images/products');

const getProductImagePath = async (name) => {
  const fileName = name + '.jpg';
  const imagePath = path.join(outputDir, fileName);
  try {
    await fsPromises.access(imagePath, fsPromises.constants.F_OK);
    return imagePath;
  }
  catch (accessError) {
    return '';
  }
}

const processImage = async (buffer, outputPath) => {
  try {
    await sharp(buffer)
      .resize(targetSize, targetSize, {
        fit: 'cover'
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    return true;
  } catch (sharpError) {
    return false;
  }
}

//returns no filepath if something went wrong.
const downloadImage = async (name, buffer) => {
  const fileName = name + '.jpg';
  const outputPath = path.join(outputDir, fileName);
  const errors = [];

  const processingResult = await processImage(buffer, outputPath);

  if (processingResult) {
    return { outputPath, errors: null};
  }
  else{
    errors.push("Image processing failed");
    return {outputPath: null, errors};
  }
};

const renameFile = async (originalFilepath, newFilepath) => {
  try{
    await fsPromises.rename(originalFilepath, newFilepath);
    return true;
  }
  catch{
    return false;
  }
}

const deleteImage = async (filepath) => {
  try {
    await fsPromises.access(filepath, fsPromises.constants.F_OK);
    await fsPromises.unlink(filepath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return true; //file not found
    } else {
      return false;
    }
  }
};

module.exports = {
  downloadImage,
  deleteImage,
  getProductImagePath,
  renameFile
};