const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Config
const inputDir = path.join(__dirname, 'raw');
const outputDir = path.join(__dirname, 'standardized');
const targetSize = 512;

// Make sure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Standardize image name from product name
function toFileName(name) {
  return name.toLowerCase().replace(/\s+/g, '_') + '.jpg';
}

// List of product names from your seed data
const productNames = [
  'Apples', 'Bananas', 'Oranges', 'Strawberries', 'Blueberries', 'Grapes',
  'Carrots', 'Broccoli', 'Spinach', 'Potatoes', 'Onions', 'Bell Peppers',
  'Milk', 'Eggs', 'Cheese', 'Yogurt', 'Butter',
  'Chicken Breast', 'Ground Beef', 'Pork Chops', 'Salmon Fillet', 'Turkey',
  'Bread', 'Bagels', 'Muffins', 'Croissants', 'Cookies',
  'Rice', 'Pasta', 'Cereal', 'Canned Soup', 'Flour'
];

// Process each product
productNames.forEach(async (name, index) => {
  const filename = fs.readdirSync(inputDir)[index]; // assumes ordering matches
  const newFilename = toFileName(name);
  const inputPath = path.join(inputDir, filename);
  const outputPath = path.join(outputDir, newFilename);

  try {
    await sharp(inputPath)
      .resize(targetSize, targetSize, {
        fit: 'cover',
      })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    console.log(`✔ Saved ${newFilename}`);
  } catch (err) {
    console.error(`✖ Failed ${filename}:`, err.message);
  }
});
