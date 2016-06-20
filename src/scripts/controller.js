/*
* controller.js
*
* The main controller.
*/
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  // Define the controller.
  app.controller = {
    setView: setView
  };

  /**
   * Sets the view using the route and query string defined in the location
   * hash.
   * @param {string} locationHash - The location hash.
   */
  function setView(locationHash) {
    // A regular expression capturing the route and query string.
    // Example:
    //   #/(route/somewhere)(?foo=1)
    var re = /#\/?([^\?\n]+)(\?.+)?/;
    var results = re.exec(locationHash) || [];

    var route = results[1] || '';
    var queryStr = results[2] || '';

    var params = _parseQueryStr(queryStr);

    // app.view.render(route, params);
  }

  /**
   * Parses a query string to produce an object. Comma-separated values are
   * concatenated into an array, and keys with missing values are assigned the
   * null value.
   * @param {string} str - The query string to parse.
   * @return {object} - The parsed query string as an object.
   */
  function _parseQueryStr(str) {
    // Example query string format:
    //    ?tags=js&dates=010116,311216

    // Enforce argument type.
    if (typeof str !== 'string') {
      throw new TypeError('The first argument to _parseQueryStr must be a ' +
                          'string.');
    }

    // Trim the preceding '?' if present.
    if (str[0] === '?') {
      str = str.slice(1);
    }

    // Split into an array of parameters.
    var params = str.split('&');

    // Transform the params array.
    params = params
      // Filter out empty strings.
      // (Handles the edge-cases: '?foo=bar&&baz=qux' and '?'.)
      .filter(function(param) {
        // (I'm being explicit here; could just return param.)
        return param.length !== 0;
      })
      // Map the parameter strings to objects.
      .map(function(param) {
        var result = {};

        param = param.split('=');
        var key = param[0];
        var value = param[1] || null;

        // If value contains ',' separated entries...
        if (/,/.test(value)) {
          // Convert value to an array.
          value = value.split(',');
        }

        result[key] = value;
        return result;
      });

    return params;
  }
})();
