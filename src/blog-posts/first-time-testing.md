# First Time Tester

**Trying to test an SPA with Tape, Sinon, and jsdom.**

*Updated: July 5, 2016*

My experience with testing is extremely limited, and this is my first time implementing tests for one of my own applications. I'm learning as I work, so please forgive and point out any mistakes in this post.

I've decided to use [Tape](https://github.com/substack/tape) paired with [Sinon](http://sinonjs.org/) for testing after reading a [great article](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4#.z8fuw2dby) by Eric Elliott and [another one](https://ponyfoo.com/articles/testing-javascript-modules-with-tape) by Nicolás Bevacqua of Pony Foo.

```js
var test = require('tape');
var sinon = require('sinon');
// Somehow import foo.js, which defines window.foo.

test('subscribing', function(t) {
  var spy = sinon.spy();
  window.foo.subscribe(spy);
  window.foo.doSomething();
  t.equal(spy.calledOnce, true, 'the subscribed spy was called once');
  t.end();
});
```

So, looking at the above I'm missing the bit where I import `foo.js` and end up with `foo.subscribe` and `foo.doSomething` methods on `window`.

Now I'm doing something here that might be a bit ridiculous, but please bear with me while I try to explain myself.

To keep my JavaScript modular without using something like Browserify, I use [IIFEs](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression) (Immediately Invoked Function Expressions) and define properties on the global `window` object. (I don't believe this is an unusual practice.)

```js
// foo.js
(function() {
  var foo = {};

  foo.subscribe = subscribe;
  foo.doSomething = doSomething;

  window.foo = foo;

  function subscribe(cb) { /* ... */ }
  function doSomething() { /* ... */ }
})();
```

If I just `require('foo.js')`, the code inside will be immediately invoked and will attempt to define a property on `window`. I'm running my tests in Node, so `window` doesn't exist by default in the global scope, which causes an error. I could define `window` globally in Node, but I want to keep each test isolated and capable of running asynchronously, so having them all interact with the same global variable isn't great. Additionally, since I'm testing code meant to run in the browser I'd like to just test the code in a full browser environment all the time.

My solution is to use [jsdom](https://github.com/tmpvar/jsdom/), which provides a JavaScript implementation of the DOM for use with Node.

Using jsdom, I can do the following:

```js
var test = require('tape');
var jsdom = require('jsdom');

test('subscribing', function(t) {
  // Setup a new virtual DOM and include the file to test.
  jsdom.env({
    html: '<body></body>',
    scripts: ['foo.js'],
    done: runTest
  });

  // Runs the test once the virtual DOM window is ready.
  function runTest(err, window) {
    if (err) {
      throw new Error('Window creation failed.');
    }

    var spy = sinon.spy();
    window.foo.subscribe(spy);
    window.foo.doSomething();
    t.equal(spy.calledOnce, true, 'the subscribed spy was called once');
    t.end();

    // Close the window now that we're done with it.
    window.close();
  }
});
```

I'm doubtful that this is good practice since I assume I'm using a lot of resources by creating a new virtual DOM for each test I run, but it does succeed in allowing me to execute multiple tests asynchronously in isolated browser environments. It also nicely handles the IIFE pattern I'm using.

Here's the final version as of writing:

```js
// foo.test.js
var test = require('tape');
var setupWindow = require('testUtils.js').setupWindow;

test('subscribing', function(t) {
  setupWindow(['foo.js'])
  .then(function(window) {
    var spy = sinon.spy();
    window.foo.subscribe(spy);
    window.foo.doSomething();
    t.equal(spy.calledOnce, true, 'the subscribed spy was called once');
    t.end();
    window.close();
  });
});

// testUtils.js
var jsdom = require('jsdom');

exports.setupWindow = setupWindow;

// Returns a promise that resolves to the virtual DOM window.
function setupWindow(scripts) {
  return new Promise(function(resolve, reject) {
    jsdom.env({
      html: '<body></body>',
      scripts: scripts,
      done: done
    });

    function done(err, window) {
      if (err) {
        reject('Window creation failed.');
      }
      resolve(window);
    }
  });
}
```

If any of the above looks obviously wrong to you, or is just plain bad practice, please let me know. Your feedback is a valuable part of my learning process, and I'm sure there's a lot of room for improvement here.

*Tags: testing, tape, jsdom, javascript, sinon, this site*
