/* past.js
 *
 * Defines: Date.past
 *
 * Date.past is a new method on Date, which takes a string in the format
 * "[x ]day/week/month/year[s]", and returns the Date that far in the past
 * relative to Date.now.
 */
'use strict';

Date.past = past;

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
    throw new Error('First argument to Date.past must be a string in the ' +
                    'format: "[n ]day/week/month/year[s]".');
  }

  // Extract number and time period.
  re = re.exec(age);
  // If no number, use 1.
  var n = re[1] || 1;
  var period = re[2];

  // Get the current date.
  var date = new Date(Date.now());

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
      throw new Error('Date.past failed to handle time period specified ' +
                      'in argument.');
  }

  // Return the adjusted date.
  return date;
}
