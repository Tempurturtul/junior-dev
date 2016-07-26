var fs = require('fs');
var path = require('path');

// The portfolio directory.
var portfolioDir = path.resolve(__dirname, '../portfolio-pieces');
// The target directory.
var targetDir = path.resolve(__dirname, '../src/scripts/store');

// Get all portfolio piece file names.
var files = fs.readdirSync(portfolioDir);

// Filter out the template.
files = files.filter(function(file) {
  return file !== '_template.json';
});

// Add each file's content to an array of JSON data.
var jsonData = [];

files.forEach(function(file) {
  var data = JSON.parse(fs.readFileSync(path.resolve(portfolioDir, file), 'utf8'));
  jsonData.push(data);
});

// Stringify the array of JSON data in preparation for writing to a file.
jsonData = JSON.stringify(jsonData);

// Write the array of JSON data to a new file.
fs.writeFileSync(path.resolve(targetDir, 'portfolioPieces.json'), jsonData);
