var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var fs = require('fs');
var PortfolioPiece = fs.readFileSync('src/scripts/models/PortfolioPiece.js');

test('portfolio piece model exists on window', function(t) {
  setupVDOM([PortfolioPiece])
  .then(function(window) {
    t.ok(window.app.models.PortfolioPiece,
         'window.app.models.PortfolioPiece variable exists');
    window.close();
    t.end();
  });
});

test('portfolio pieces can be created with minimal data', function(t) {
  setupVDOM([PortfolioPiece])
  .then(function(window) {
    var error = null;

    try {
      // eslint-disable-next-line
      new window.app.models.PortfolioPiece();
    } catch (err) {
      error = err;
    }

    t.equal(error, null,
      'successfully created a portfolio piece with minimal data');
    window.close();
    t.end();
  });
});

test('portfolio pieces can contain optional data',
  function(t) {
    setupVDOM([PortfolioPiece])
    .then(function(window) {
      var data = {
        title: 'A title.',
        description: 'A description.',
        tags: [],
        sourceURL: 'src/url',
        liveURL: 'live/url',
        image: {
          static: 'img.png',
          responsive: [
            {
              url: 'responsive.png',
              width: '500px'
            }
          ],
          description: 'An image description.'
        }
      };
      var piece = new window.app.models.PortfolioPiece(data);

      t.equal(piece.title, 'A title.', 'contains title data');
      t.equal(piece.description, 'A description.', 'contains description data');
      t.deepEqual(piece.tags, [], 'contains tags data');
      t.equal(piece.sourceURL, 'src/url', 'contains source url data');
      t.equal(piece.liveURL, 'live/url', 'contains live url data');
      t.deepEqual(piece.image, {
        static: 'img.png',
        responsive: [
          {
            url: 'responsive.png',
            width: '500px'
          }
        ],
        description: 'An image description.'
      }, 'contains image data');
      window.close();
      t.end();
    });
  });
