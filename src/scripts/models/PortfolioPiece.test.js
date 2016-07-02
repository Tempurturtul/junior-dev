var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var fs = require('fs');
var PortfolioPiece = fs.readFileSync('src/scripts/models/PortfolioPiece.js');

test('portfolio piece model exists', function(t) {
  setupVDOM([PortfolioPiece])
  .then(function(window) {
    t.ok(window.app.models.PortfolioPiece,
         'window.app.models.PortfolioPiece variable exists');
    window.close();
    t.end();
  });
});

test('portfolio pieces only require a title', function(t) {
  setupVDOM([PortfolioPiece])
  .then(function(window) {
    var data = {
      title: 'A title.'
    };
    var error = null;

    try {
      // eslint-disable-next-line
      new window.app.models.PortfolioPiece(data);
    } catch (err) {
      error = err;
    }

    t.equal(error, null,
      'successfully created a portfolio piece with minimal data');
    window.close();
    t.end();
  });
});

test('portfolio pieces can contain optional data', function(t) {
  setupVDOM([PortfolioPiece])
  .then(function(window) {
    var data = {
      title: 'A title.',
      liveURL: 'live/url',
      sourceURL: 'src/url',
      images: [],
      description: 'A description.'
    };
    var piece = new window.app.models.PortfolioPiece(data);

    t.equal(piece.liveURL, 'live/url', 'contains a live url');
    t.equal(piece.sourceURL, 'src/url', 'contains a source url');
    t.deepEqual(piece.images, [], 'contains an images array');
    t.equal(piece.description, 'A description.', 'contains a description');
    window.close();
    t.end();
  });
});
