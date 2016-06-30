var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var fs = require('fs');
var Post = fs.readFileSync('src/scripts/models/Post.js');

test('post model exists', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    t.ok(window.app.models.Post,
         'window.app.models.Post variable exists');
    window.close();
    t.end();
  });
});

test('post only requires a title, content, and data', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    var data = {
      title: 'A title.',
      content: 'Some content.',
      date: new Date()
    }
    var post;

    try {
      post = new window.app.models.Post(data);
    } catch(err) {
      t.fail('failed to create a post with minimal data');
      window.close();
      t.end();
    }

    t.pass('successfully created a post with minimal data');
    window.close();
    t.end();
  });
});

test('post can contain optional data', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    var data = {
      title: 'A title.',
      content: 'Some content.',
      date: new Date(),
      tags: ['html', 'css', 'js']
    }
    var post = new window.app.models.Post(data);

    t.deepEqual(post.tags, ['html', 'css', 'js'], 'contains tags');
    window.close();
    t.end();
  });
});
