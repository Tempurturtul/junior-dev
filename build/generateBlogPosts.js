var fs = require('fs');
var path = require('path');
var showdown = require('showdown');
var converter = new showdown.Converter({noHeaderId: true});

// The blog posts directory.
var postsDir = path.resolve(__dirname, '../blog-posts');
// The target directory.
var targetDir = path.resolve(__dirname, '../src/scripts/store');

// Get all blog post file names.
var files = fs.readdirSync(postsDir);

// Filter out the template.
files = files.filter(function(file) {
  return file !== '_template.md';
});

// Declare an empty array to hold JSON data.
var jsonData = [];

// For each file...
files.forEach(function(file) {
  // Get the contents as a string.
  var data = fs.readFileSync(path.resolve(postsDir, file), 'utf8');

  // Parse the contents.
  data = parsePost(data);

  // Push the parsed contents to the array of JSON data.
  jsonData.push(data);
});

// Stringify the array of JSON data in preparation for writing to a file.
jsonData = JSON.stringify(jsonData);

// Write the array of JSON data to a new file.
fs.writeFileSync(path.resolve(targetDir, 'posts.json'), jsonData);

/**
 * Parses data into a JSON object describing a blog post.
 * @param {string} data - String of content from a markdown format blog post.
 */
function parsePost(data) {
  var parsed = {};

  // This regexp isolates title (1), subtitle (2), created date (3), modified date (4), and combined
  // content & tags (5).
  var re = /^(#\s[^\n]+\n\n)?(\*\*[^\*]+\*\*\n\n)?(\*Created:\s[^\*]+\*\n\n)?(\*Last\smodified:\s[^\*]+\*\n\n)?([\s\S]+)$/;
  var results = re.exec(data) || [];

  // This regexp only matches if tags are present, and isolates the content (1)
  // and tags (2) from the previous combined result if a match is found.
  var reWithTags = /^([\s\S]*)(\*Tags:\s.+\*\n)$/;
  var resultsWithTags = reWithTags.exec(results[5]);

  var title = results[1];
  var subtitle = results[2];
  var created = results[3];
  var modified = results[4];
  // If the regexp reWithTags fails to match, tags aren't present. Therefore,
  // results[5] contains only post content.
  var content = resultsWithTags ? resultsWithTags[1] : results[5];
  var tags = resultsWithTags ? resultsWithTags[2] : undefined;

  // Parse the isolated data.
  parsed.title = title ? title.substring(2, title.length - 2) : null;
  parsed.subtitle = subtitle ? subtitle.substring(2, subtitle.length - 4) : null;
  parsed.created = created ? new Date(created.substring(10, created.length - 3)) : null;
  parsed.modified = modified ? new Date(modified.substring(16, modified.length - 3)) : null;
  parsed.content = content ? converter.makeHtml(content) : null;
  parsed.tags = tags ? tags.substring(7, tags.length - 2).split(', ') : null;

  // Return parsed data.
  return parsed;
}
