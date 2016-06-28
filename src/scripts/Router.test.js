var test = require('tape');
var jsdom = require('jsdom');
var fs = require('fs');
var Router = fs.readFileSync('./src/scripts/Router.js');

test('router exists globally', function(t) {
  // Setup virtual DOM.
  jsdom.env({
    html: '<body></body>',
    url: 'https://foo.bar',
    src: [Router],
    done: vdomReady
  });

  function vdomReady(err, window) {
    if (err) {
      throw new Error('Virtual DOM creation failed.');
    }

    t.ok(window.app.Router, 'window.app.Router variable exists');

    window.close();
    t.end();
  }
});

test('router registers routes', function(t) {
  // Setup virtual DOM.
  jsdom.env({
    html: '<body></body>',
    url: 'https://foo.bar',
    src: [Router],
    done: vdomReady
  });

  function vdomReady(err, window) {
    if (err) {
      throw new Error('Virtual DOM creation failed.');
    }

    var router = new window.app.Router();
    var registered = false;

    router.register('blog', function() { registered = true; });
    router.start();

    navigateAround(window, [
      '/#/blog'  // Should match.
    ], function() {
      t.ok(registered, 'route\'s handler called');

      window.close();
      t.end();
    });
  }
});

test('router only calls route handler when appropriate', function(t) {
  // Setup virtual DOM.
  jsdom.env({
    html: '<body></body>',
    url: 'https://foo.bar',
    src: [Router],
    done: vdomReady
  });

  function vdomReady(err, window) {
    if (err) {
      throw new Error('Virtual DOM creation failed.');
    }

    var router = new window.app.Router();
    var counter = 0;

    router.register('blog', function() { counter++; });
    router.start();

    navigateAround(window, [
      '/#/blog',  // Should match.
      '/#/blo',
      '/#/blogs',
      '/#/blog/foo',
      '/#/blog/', // Should match.
      '/#/blog' // Should match.
    ], function() {
      t.equal(counter, 3, 'route\'s handler only called when appropriate');

      window.close();
      t.end();
    });
  }
});

/**
 * Navigates to each hash location in 250ms intervals, then calls done.
 * @param {string[]} places - The hash locations to navigate to.
 * @param {function} done - A callback invoked when finished.
 */
function navigateAround(window, places, done) {
  start(places);

  function start(places) {
    if (!places.length) {
      done();
    } else {
      jsdom.changeURL(window, window.location.href.split('/#')[0] + places[0]);
      setTimeout(function() { start(places.slice(1)); }, 250);
    }
  }
}
