var path = require('path');
var test = require('tape');
var testUtils = require(path.join(process.cwd(), 'test-utils/utils.js'));
var setupVDOM = testUtils.setupVDOM;
var fs = require('fs');
var past = fs.readFileSync('src/scripts/utils/past.js');

test('past util exists on window', function(t) {
  setupVDOM([past])
  .then(function(window) {
    t.ok(window.app.utils.past, 'window.app.utils.past variable exists');
    window.close();
    t.end();
  });
});

test('past util handles time units (day|week|month|year)', function(t) {
  setupVDOM([past])
  .then(function(window) {
    var past = window.app.utils.past;
    var today = new Date();

    var yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    var lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    var lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    t.equal(yesterday.toLocaleDateString(),
            past('day').toLocaleDateString(),
            '"day" produces the expected date');
    t.equal(lastWeek.toLocaleDateString(),
            past('week').toLocaleDateString(),
            '"week" produces the expected date');
    t.equal(lastMonth.toLocaleDateString(),
            past('month').toLocaleDateString(),
            '"month" produces the expected date');
    t.equal(lastYear.toLocaleDateString(),
            past('year').toLocaleDateString(),
            '"year" produces the expected date');

    window.close();
    t.end();
  });
});

// Expecting failure.
test.skip('past util handles multiple-digit numbers', function(t) {

});
