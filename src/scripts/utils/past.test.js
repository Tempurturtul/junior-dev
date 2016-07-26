var test = require('tape');
var path = require('path');

// Execute past.js.
require(path.join(process.cwd(), 'src/scripts/utils/past.js'));

test('past is defined on Date', function(t) {
  t.ok(Date.past, 'past is defined');
  t.end();
});

// Expecting failure.
test.skip('past handles multiple-digit numbers', function(t) {
  
});
