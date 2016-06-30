var jsdom = require('jsdom');

exports.setupVDOM = setupVDOM;
exports.navigateAround = navigateAround;

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
