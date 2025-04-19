const path = require('path');
const sharp = require('sharp');
const fsPromises = require('fs').promises;
//config
const targetSize = 512;
const outputDir = path.join(__dirname, '../assets/images/products');

const imageExists = async (filePath) => {
  try {
    await fsPromises.access(filePath, fsPromises.constants.F_OK);
    return true;
  }
  catch (accessError) {
    return false;
  }
}

const processImage = async (filePath, outputPath) => {
  try {
    await sharp(filePath)
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
const downloadMulterImage = async (name, filePath) => {
  const fileName = name + '.jpg';
  const outputPath = path.join(outputDir, fileName);
  const errors = [];

  if(await imageExists(outputPath)){
    //delete temporary file saved by multer
    await deleteImage(filePath);
    return {outputPath: null, errors: ["Image already exists"] };
  }

    const processingResult = await processImage(filePath, outputPath);

    //delete file multer has saved
    const tempFileDeletionResult = await deleteImage(filePath);

    if(!tempFileDeletionResult){
      errors.push("Deleting Temp File Failed");
    }

    if (processingResult) {

      return { outputPath, errors: null};
    }
    else{
      errors.push("Image processing failed");
      return {outputPath: null, errors};
    }
};



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
  downloadMulterImage,
  deleteImage
};