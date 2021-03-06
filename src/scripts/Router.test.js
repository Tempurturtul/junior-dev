var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var navigateAround = testUtils.navigateAround;
var fs = require('fs');
var Router = fs.readFileSync('src/scripts/Router.js');

test('router exists on window', function(t) {
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

test('router calls route handler for correct routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var counter = 0;

    router.register('blog', function() {
      counter++;
    });
    router.register('foo', function() {
      counter++;
    });
    router.start();

    navigateAround(window, [
      '/#/blog',  // Should match.
      '/#/blo',
      '/#/blogs',
      '/#/blog/foo',
      '/#/blog/',  // Should match.
      '/#/blog',  // Should match.
      '/#/foo',   // Should match.
      '/#/foo/'  // Should match.
    ]).then(function() {
      t.equal(counter, 5, 'route\'s handler called expected number of times');
      window.close();
      t.end();
    });
  });
});

test('router unregisters routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var counter = 0;

    router.register('blog', function() {
      counter++;
    });
    router.start();

    navigateAround(window, [
      '/#/blog'
    ])
    .then(function() {
      router.unregister('blog');
      return navigateAround(window, [
        '/#/blog'
      ]);
    })
    .then(function() {
      t.equal(counter, 1, 'route\'s handler called expected number of times');
      window.close();
      t.end();
    });
  });
});

test('router starts suspended', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var failed = false;

    router.register('fail', function() {
      failed = true;
    });

    // Router should not be started initially.
    navigateAround(window, [
      '/#/fail'
    ])
    .then(function() {
      t.notOk(failed, 'route handler wasn\'t called before ' +
                      'starting/unsuspending');
      window.close();
      t.end();
    });
  });
});

test('router suspends/unsuspends when instructed', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var failed = false;
    var counter = 0;

    router.register('count', function() {
      counter++;
    });
    router.register('fail', function() {
      failed = true;
    });
    router.start();

    navigateAround(window, [
      '/#/count'  // counter === 1
    ])
    .then(function() {
      // Suspend the router.
      router.suspend();
      return navigateAround(window, [
        '/#/fail'
      ]);
    })
    .then(function() {
      // Unsuspend the router.
      router.unsuspend();
      return navigateAround(window, [
        '/#/count'  // counter === 2
      ]);
    })
    .then(function() {
      t.ok(!failed && counter === 2, 'router didn\'t call route handlers ' +
                                     'while suspended, did while unsuspended');
      window.close();
      t.end();
    });
  });
});

test('router checks current route when instructed', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var passed = false;

    router.register('pass', function() {
      passed = true;
    });

    // Router is suspended.
    navigateAround(window, [
      '/#/foo',
      '/#/pass'
    ])
    .then(function() {
      // Unsuspend the router and check the current route.
      router.unsuspend(true);
      // Give the router time to handle the route...
      return new Promise(function(resolve, reject) {
        setTimeout(resolve, 250);
      });
    })
    .then(function() {
      t.ok(passed, 'router handled the current route');
      window.close();
      t.end();
    });
  });
});

test('router handles empty string routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var passed = false;

    router.register('', function(params) {
      passed = true;
    });
    router.start(true);

    navigateAround(window, [
      '/#'
    ])
    .then(function() {
      t.ok(passed, 'router handled the empty string route');
      window.close();
      t.end();
    });
  });
});

test('router handles parameterized routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var date;
    var post;

    router.register('blog/:date/:post', function(params) {
      if (params) {
        date = params.date;
        post = params.post;
      }
    });
    router.start();

    navigateAround(window, [
      '/#/blog/063016/hello-world'
    ])
    .then(function() {
      t.equal(date, '063016',
        'retrieved date string from parameterized route');
      t.equal(post, 'hello-world',
        'retrieved post string from parameterized route');
      window.close();
      t.end();
    });
  });
});

test('router handles query strings', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var date;
    var post;
    var tags;

    router.register('blog', function(params) {
      if (params) {
        date = params.date;
        post = params.post;
        tags = params.tags;
      }
    });
    router.start();

    navigateAround(window, [
      '/#/blog?date=063016&post=hello-world&tags=html,css,js'
    ])
    .then(function() {
      t.equal(date, '063016',
        'retrieved date string from query string');
      t.equal(post, 'hello-world',
        'retrieved post string from query string');
      t.deepEqual(tags, ['html', 'css', 'js'],
        'retrieved tags array from query string');
      window.close();
      t.end();
    });
  });
});

test('router handles query string keys without values', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var foo = true;
    var qux = true;

    router.register('blog', function(params) {
      if (params) {
        foo = params.foo;
        qux = params.qux;
      }
    });
    router.start();

    navigateAround(window, [
      '/#/blog?foo&bar=something&qux='
    ])
    .then(function() {
      t.equal(foo, null, 'query string "foo" set to null');
      t.equal(qux, null, 'query string "qux=" set to null');
      window.close();
      t.end();
    });
  });
});

test('router handles both query strs and param routes', function(t) {
  setupVDOM([Router])
  .then(function(window) {
    var router = new window.app.Router();
    var date;
    var post;
    var tags;

    router.register('blog/:date', function(params) {
      if (params) {
        date = params.date;
        post = params.post;
        tags = params.tags;
      }
    });
    router.start();

    navigateAround(window, [
      '/#/blog/063016?tags=html,css,js&post=hello-world'
    ])
    .then(function() {
      t.equal(date, '063016',
        'retrieved date string from route parameterization');
      t.equal(post, 'hello-world',
        'retrieved post string from query string');
      t.deepEqual(tags, ['html', 'css', 'js'],
        'retrieved tags array from query string');
      window.close();
      t.end();
    });
  });
});
