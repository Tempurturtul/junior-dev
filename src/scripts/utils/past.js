/* past.js
 *
 * Defines: window.app.utils.past
 *
 * The past function takes a string in the format
 * "[x ]day/week/month/year[s]", and returns the Date that far in the past
 * relative to Date.now.
 */
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.utils = app.utils || {};
  app.utils.past = past;

  /**
   * Gets a date in the past relative to Date.now and the given age.
   * @param {string} age - An age string in the format
   * "[n ]day/week/month/year[s]".
   * @return {Date} - The past date.
   */
  function past(age) {
    var re = /^(\d)?\s?(day|week|month|year)\s?$/i;

    // Check for invalid input.
    if (!re.test(age)) {
      throw new Error('First argument to past function must be a string in ' +
                      'the format: "[n ]day/week/month/year[s]".');
    }

    // Extract number and time period.
    re = re.exec(age);
    // If no number, use 1.
    var n = re[1] || 1;
    var period = re[2];

    // Get the current date.
    var date = new Date();

    // Adjust the current date.
    switch (period) {
      case 'day':
        date.setDate(date.getDate() - n);
        break;
      case 'week':
        date.setDate(date.getDate() - n * 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - n);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - n);
        break;
      default:
        throw new Error('Failed to handle time period specified in argument' +
                        'to past function.');
    }

    // Return the adjusted date.
    return date;
  }
})();
