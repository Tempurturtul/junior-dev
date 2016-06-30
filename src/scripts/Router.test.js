var test = require('tape');
var jsdom = require('jsdom');
var fs = require('fs');
var Router = fs.readFileSync('./src/scripts/Router.js');

test('router exists globally', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    t.ok(window.app.Router, 'window.app.Router variable exists');
    window.close();
    t.end();
  });
});

test('router registers routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var registered = false;

    router.register('blog', function() {
      registered = true;
    });
    router.start();

    navigateAround(window, [
      '/#/blog'  // Should match.
    ])
    .then(function() {
      t.ok(registered, 'route\'s handler called');
      window.close();
      t.end();
    });
  });
});

test('router only calls route handler when appropriate', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var counter = 0;

    router.register('blog', function() {
      counter++;
    });
    router.start();

    navigateAround(window, [
      '/#/blog',  // Should match.
      '/#/blo',
      '/#/blogs',
      '/#/blog/foo',
      '/#/blog/', // Should match.
      '/#/blog' // Should match.
    ]).then(function() {
      t.equal(counter, 3, 'route\'s handler only called when appropriate');
      window.close();
      t.end();
    });
  });
});

/**
 * Returns a promise to set up a virtual DOM.
 * @param {string[]} src - An array of JavaScript strings to insert as
 * scripts in the virtual DOM.
 * @param {string} [url] - The virtual DOM window's location.href.
 * @return {Promise} - The promise to return a reference to a virtual DOM.
 */
function setupVDOM(src, url) {
  return new Promise(function(resolve, reject) {
    // Setup virtual DOM.
    jsdom.env({
      html: '<body></body>',
      url: url,
      src: src,
      done: function(err, window) {
        if (err) {
          reject('Virtual DOM creation failed.');
        }
        resolve(window);
      }
    });
  });
}

/**
 * Returns a promise to navigate to each hash location in 250ms intervals.
 * @param {object} window - A reference to the virtual DOM window used.
 * @param {string[]} places - The hash locations to navigate to.
 * @return {Promise} - The promise to navigate to each hash location.
 */
function navigateAround(window, places) {
  return new Promise(function(resolve, reject) {
    next(places, resolve);
  });

  /**
   * Navigates to the next place in places, then recursively calls itself
   * after a brief delay. Calls done when no places left.
   * @param {string[]} places - The hash locations to navigate to.
   * @param {function} done - The callback to invoke when there are no
   * places left.
   */
  function next(places, done) {
    if (places.length) {
      jsdom.changeURL(window, window.location.href.split('/#')[0] + places[0]);

      setTimeout(function() {
        next(places.slice(1), done);
      }, 250);
    } else {
      done();
    }
  }
}
