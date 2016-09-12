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

    var yesterday = new Date(today.getFullYear(),
                             today.getMonth(),
                             today.getDate() - 1);
    var lastWeek = new Date(today.getFullYear(),
                            today.getMonth(),
                            today.getDate() - 7);
    var lastMonth = new Date(today.getFullYear(),
                             today.getMonth() - 1,
                             today.getDate());
    var lastYear = new Date(today.getFullYear() - 1,
                            today.getMonth(),
                            today.getDate());

    yesterday = yesterday.toLocaleDateString();
    lastWeek = lastWeek.toLocaleDateString();
    lastMonth = lastMonth.toLocaleDateString();
    lastYear = lastYear.toLocaleDateString();

    try {
      var pastDay = past('day').toLocaleDateString();
      var pastWeek = past('week').toLocaleDateString();
      var pastMonth = past('month').toLocaleDateString();
      var pastYear = past('year').toLocaleDateString();

      t.equal(yesterday, pastDay, '"day" produces the expected date');
      t.equal(lastWeek, pastWeek, '"week" produces the expected date');
      t.equal(lastMonth, pastMonth, '"month" produces the expected date');
      t.equal(lastYear, pastYear, '"year" produces the expected date');

      window.close();
      t.end();
    } catch (err) {
      t.fail(err);
      window.close();
      t.end();
    }
  });
});

test('past util handles time units pluralized', function(t) {
  setupVDOM([past])
  .then(function(window) {
    var past = window.app.utils.past;
    var today = new Date();

    var yesterday = new Date(today.getFullYear(),
                             today.getMonth(),
                             today.getDate() - 1);
    var lastWeek = new Date(today.getFullYear(),
                            today.getMonth(),
                            today.getDate() - 7);
    var lastMonth = new Date(today.getFullYear(),
                             today.getMonth() - 1,
                             today.getDate());
    var lastYear = new Date(today.getFullYear() - 1,
                            today.getMonth(),
                            today.getDate());

    yesterday = yesterday.toLocaleDateString();
    lastWeek = lastWeek.toLocaleDateString();
    lastMonth = lastMonth.toLocaleDateString();
    lastYear = lastYear.toLocaleDateString();

    try {
      var pastDay = past('days').toLocaleDateString();
      var pastWeek = past('weeks').toLocaleDateString();
      var pastMonth = past('months').toLocaleDateString();
      var pastYear = past('years').toLocaleDateString();

      t.equal(yesterday, pastDay, '"days" produces the expected date');
      t.equal(lastWeek, pastWeek, '"weeks" produces the expected date');
      t.equal(lastMonth, pastMonth, '"months" produces the expected date');
      t.equal(lastYear, pastYear, '"years" produces the expected date');

      window.close();
      t.end();
    } catch (err) {
      t.fail(err);
      window.close();
      t.end();
    }
  });
});

test('past util handles multiplied time units', function(t) {
  setupVDOM([past])
  .then(function(window) {
    var past = window.app.utils.past;
    var today = new Date();

    var zeroDaysAgo = today;
    var twoDaysAgo = new Date(today.getFullYear(),
                              today.getMonth(),
                              today.getDate() - 1 * 2);
    var fiveWeeksAgo = new Date(today.getFullYear(),
                                today.getMonth(),
                                today.getDate() - 7 * 5);
    var twelveMonthsAgo = new Date(today.getFullYear(),
                                   today.getMonth() - 1 * 12,
                                   today.getDate());
    var fortyYearsAgo = new Date(today.getFullYear() - 1 * 40,
                                 today.getMonth(),
                                 today.getDate());

    zeroDaysAgo = zeroDaysAgo.toLocaleDateString();
    twoDaysAgo = twoDaysAgo.toLocaleDateString();
    fiveWeeksAgo = fiveWeeksAgo.toLocaleDateString();
    twelveMonthsAgo = twelveMonthsAgo.toLocaleDateString();
    fortyYearsAgo = fortyYearsAgo.toLocaleDateString();

    try {
      var pastZeroDays = past('0 day').toLocaleDateString();
      var pastTwoDays = past('2 day').toLocaleDateString();
      var pastFiveWeeks = past('5 week').toLocaleDateString();
      var pastTwelveMonths = past('12 month').toLocaleDateString();
      var pastFortyYears = past('40 year').toLocaleDateString();

      t.equal(zeroDaysAgo, pastZeroDays,
        '"0 day" produces the expected date');
      t.equal(twoDaysAgo, pastTwoDays,
        '"2 day" produces the expected date');
      t.equal(fiveWeeksAgo, pastFiveWeeks,
        '"5 week" produces the expected date');
      t.equal(twelveMonthsAgo, pastTwelveMonths,
        '"12 month" produces the expected date');
      t.equal(fortyYearsAgo, pastFortyYears,
        '"40 year" produces the expected date');

      window.close();
      t.end();
    } catch (err) {
      t.fail(err);
      window.close();
      t.end();
    }
  });
});
