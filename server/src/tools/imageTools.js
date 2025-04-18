const path = require('path');
const sharp = require('sharp');
const fsPromises = require('fs').promises;
//config
const targetSize = 512;
const outputDir = path.join(__dirname, '../assets/images/products');

//returns no filepath if something went wrong.
const downloadMulterImage = async (name, filePath) => {
  const fileName = name + '.jpg';
  const outputPath = path.join(outputDir, fileName);

  try {
    await fsPromises.access(outputPath, fsPromises.constants.F_OK);
    return '';
  } catch (accessError) { //if file does not exist download the image
    try {
      await sharp(filePath)
        .resize(targetSize, targetSize, {
          fit: 'cover'
        })
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      await deleteImage(filePath); // delete temporary image
      return outputPath; // Return the full output path on success
    } catch (sharpError) {
      console.error("Error processing image:", sharpError);
      return ''; // Return no filepath on Sharp error
    }
  }
};



const deleteImage = async (filepath) => {
  try {
    await fsPromises.access(filepath, fsPromises.constants.F_OK);
    await fsPromises.unlink(filepath);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  downloadMulterImage,
  deleteImage
};