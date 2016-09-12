var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var fs = require('fs');
var Post = fs.readFileSync('src/scripts/models/Post.js');

test('post model exists on window', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    t.ok(window.app.models.Post,
         'window.app.models.Post variable exists');
    window.close();
    t.end();
  });
});

test('post can be created with minimal data', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    var error = null;

    try {
      // eslint-disable-next-line
      new window.app.models.Post();
    } catch (err) {
      error = err;
    }

    t.equal(error, null,
      'successfully created a post with minimal data');
    window.close();
    t.end();
  });
});

test('post can contain optional data', function(t) {
  setupVDOM([Post])
  .then(function(window) {
    var data = {
      title: 'A title.',
      subtitle: 'A subtitle.',
      created: 'July 7, 1777',
      modified: 'December 19, 2999',
      content: 'Some content.',
      tags: ['html', 'css', 'js']
    };
    var post = new window.app.models.Post(data);
    var createdISO = new Date('July 7, 1777').toISOString();
    var modifiedISO = new Date('December 19, 2999').toISOString();

    t.equal(post.title, 'A title.', 'contains a title');
    t.equal(post.subtitle, 'A subtitle.', 'contains a subtitle');
    t.equal(post.created.toISOString(), createdISO, 'contains a created date');
    t.equal(post.modified.toISOString(), modifiedISO,
      'contains a modified date');
    t.equal(post.content, 'Some content.', 'contains content');
    t.deepEqual(post.tags, ['html', 'css', 'js'], 'contains tags');
    window.close();
    t.end();
  });
});
