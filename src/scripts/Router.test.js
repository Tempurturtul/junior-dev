var test = require('tape');
var jsdom = require('jsdom');

// Setup virtual DOM.
jsdom.env({
  html: '<body></body>',
  scripts: ['src/scripts/Router.js'],
  done: tests
});

/**
 * Executes tests with access to a virtual DOM.
 * @param {Error|null} err - Virtual DOM creation error or null.
 * @param {object} window - Fully-loaded virtual DOM window.
 */
function tests(err, window) {
  if (err) {
    throw new Error('Virtual DOM creation failed.');
  }

  var document = window.document;

  test('Router\'s global variables', function(t) {
    t.ok(window.app, 'There should be a global app variable.');
    t.ok(window.app.Router, 'There should be a global app.Router variable.');
    t.end();
  });

  test.skip('Router.registerRoute', function(t) {

    t.end();
  });

  test.skip('Router.unregisterRoute', function(t) {

    t.end();
  });

  test.skip('Router.suspendRoute', function(t) {

    t.end();
  });

  test.skip('Router.unsuspendRoute', function(t) {

    t.end();
  });

  test.skip('Router.start', function(t) {

    t.end();
  });

  window.close();
}
