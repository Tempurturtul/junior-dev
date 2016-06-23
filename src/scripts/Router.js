// Router.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.Router = Router;

  /**
   * A minimal hash router.
   * @constructor
   */
  function Router() {
    var self = this;
    var routes = [];
    var suspended = true;

    self.registerRoute = registerRoute;
    self.unregisterRoute = unregisterRoute;
    self.suspend = suspend;
    self.unsuspend = unsuspend;
    self.start = start;

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Registers the route with the given handler.
     * @param {string} route - The route to register. Must not include a
     * preceding hash (#) or a preceding slash (/). May include parameterized
     * components in the form of a parameter key preceded by a colon.
     * @param {function} handler - The method invoked when the route is
     * visited.
     */
    function registerRoute(route, handler) {}

    /**
     * Unregisters the route.
     * @param {string} route - The route to unregister.
     */
    function unregisterRoute(route) {}

    /**
     * Suspends the router.
     */
    function suspend() {}

    /**
     * Unsuspends the router and optionally checks the route.
     * @param {bool} [andCheckRoute] - Whether or not to check the current
     * route.
     */
    function unsuspend(andCheckRoute) {}

    /**
     * Starts the router. An alias for Router.unsuspend(true).
     */
    function start() {
      unsuspend(true);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Parses a location hash to retrieve route and params properties, where
     * params is an object with key/value pairs extracted from a query string.
     * @param {string} locationHash - The location hash to parse.
     * @return {object} - The parsed results, containing `route` and
     * `params` properties.
     */
    function parseLocationHash(locationHash) {
      // A regular expression capturing the route and query string.
      // Example:
      //   #/(route/somewhere)(?foo=1)
      var re = /#\/?([^\?\n]+)(\?.+)?/;
      var results = re.exec(locationHash) || [];

      var route = results[1] || '';
      var queryStr = results[2] || '';
      var params = parseQueryStr(queryStr);

      return {
        route: route,
        params: params
      };
    }

    /**
     * Parses a query string to retrieve keys and values. Comma-separated
     * values are concatenated into arrays, and keys with missing values are
     * assigned the null value.
     * @param {string} str - The query string to parse.
     * @return {object} - The parsed results, containing a key/value pair for
     * each defined key.
     */
    function parseQueryStr(str) {
      // Example query string format:
      //    ?tags=js&dates=010116,311216

      // Enforce the argument type.
      if (typeof str !== 'string') {
        throw new TypeError('The first argument to _parseQueryStr must be a ' +
                            'string.');
      }

      var parsed = str;

      // Trim the preceding '?' if present.
      if (parsed[0] === '?') {
        parsed = parsed.slice(1);
      }

      // Split into an array of key/value pairs.
      parsed = parsed.split('&');

      // Transform the array.
      parsed = parsed
        // Filter out empty entries. (Handles the edge-cases: '?foo=bar&&baz=qux' and '?'.)
        .filter(function(pair) {
          // (I'm being explicit here; could just return pair.)
          return pair.length !== 0;
        })
        // Reduce to an object with each pair string as a key/value pair.
        .reduce(function(acc, curr) {
          // Split the current pair string into a key and value.
          curr = curr.split('=');
          var key = curr[0];
          var val = curr[1] || null;

          // If the value contains comma separated entries...
          if (/,/.test(val)) {
            // Convert the value to an array.
            val = val.split(',');
          }

          // Handle duplicate keys.
          if (acc[key]) {
            var prevVal = acc[key];

            if (Array.isArray(prevVal) && Array.isArray(val)) {
              // If both values are arrays, concatenate them.
              val = prevVal.concat(val);
            } else if (Array.isArray(prevVal) && !Array.isArray(val)) {
              // Else if the previous value is an array, append the new value to it.
              val = prevVal.push(val);
            } else if (!Array.isArray(prevVal) && Array.isArray(val)) {
              // Else if the new value is an array, prepend the previous value to it.
              val = val.unshift(prevVal);
            } else {
              // Else neither are arrays, create a new array.
              val = [prevVal, val];
            }
          }

          // Add the key/value pair to the accumulated results.
          acc[key] = val;

          return acc;
        }, {});

      return parsed;
    }
  }
})();
