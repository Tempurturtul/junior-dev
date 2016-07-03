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

    self.register = register;
    self.unregister = unregister;
    self.suspend = suspend;
    self.unsuspend = unsuspend;
    self.start = start;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Registers the route with the given handler.
     * @param {string} route - The route to register. Must not include a
     * preceding hash (#) or a preceding or ending slash (/). May include
     * parameterized components in the form of a parameter key preceded by
     * a colon.
     * @param {function} handler - The method invoked when the route is
     * visited.
     */
    function register(route, handler) {
      // Check that a valid route was passed.
      if (route[0] === '#' ||
          route[0] === '/' ||
          route[route.length - 1] === '/') {
        throw new Error('Route not registered because it contains ' +
                        'invalid start or end characters.');
      }

      // Ensure no duplicate routes.
      routes.forEach(function(entry) {
        if (entry.route === route) {
          throw new Error('Route not registered because it already exists.');
        }
      });

      // Register the route.
      routes.push({
        route: route,
        handler: handler
      });
    }

    /**
     * Unregisters the route.
     * @param {string} route - The route to unregister.
     */
    function unregister(route) {
      routes = routes.filter(function(entry) {
        return entry.route !== route;
      });
    }

    /**
     * Suspends the router.
     */
    function suspend() {
      suspended = true;
    }

    /**
     * Unsuspends the router and optionally checks the route.
     * @param {bool} [andCheckRoute] - Whether or not to check the current
     * route.
     */
    function unsuspend(andCheckRoute) {
      suspended = false;

      if (andCheckRoute) {
        handleRoute();
      }
    }

    /**
     * An alias for Router.unsuspend.
     * @param {bool} [andCheckRoute] - Whether or not to check the current
     * route.
     */
    function start(andCheckRoute) {
      unsuspend(andCheckRoute);
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the router.
     */
    function init() {
      if ('onhashchange' in window) {
        window.addEventListener('hashchange', handleRoute);
      } else {
        // Fallback for hashchange event.
        // Credit: https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
        var oldURL = window.location.href;
        var oldHash = window.location.hash;

        window.setInterval(function() {
          var newURL = location.href;
          var newHash = location.hash;

          if (newHash !== oldHash) {
            var e = {
              type: 'hashchange',
              oldURL: oldURL,
              newURL: newURL
            };

            handleRoute(e);

            oldURL = newURL;
            oldHash = newHash;
          }
        }, 100);
      }
    }

    /**
     * Handles a hash route change.
     * @param {object} e - The hashchange event.
     */
    function handleRoute() {
      // Do nothing if suspended.
      if (suspended) {
        return;
      }

      // Data on the current route, including the route itself and
      // any parameters passed in a query string.
      var routeData = parseLocationHash(window.location.hash);
      // Registered routes that match the current route, along with a
      // parameterization score (lower is better) and updated
      // collection of parameters.
      var matches = [];

      var i;
      var len = routes.length;
      var matchData;
      var routeParams;

      // For each registered route...
      for (i = 0; i < len; i++) {
        // Check for a match while considering route parameterization.
        matchData = routeMatch(routes[i].route, routeData.route);
        // If there is a match, add it to the matches array.
        if (matchData) {
          // Store and update the parameters for this route with any
          // parameterized portions of the route.
          // (Overrides identical parameters defined in a query string.)
          routeParams = routeData.params;
          for (var key in matchData.params) {
            // Exclude inherited properties.
            if (matchData.params.hasOwnProperty(key)) {
              routeParams[key] = matchData.params[key];
            }
          }

          matches.push({
            route: routes[i].route, // Currently unused.
            handler: routes[i].handler,
            params: routeParams,
            score: matchData.score
          });
        }
      }

      // If there are no matches, do nothing.
      if (!matches.length) {
        return;
      }

      // Reduce the matches array to the single closest match.
      var match = matches.reduce(function(acc, curr) {
        if (curr.score < acc.score) {
          acc = curr;
        }

        return acc;
      });

      // Call the closest match's handler with any defined params.
      match.handler(match.params);
    }

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
      var re = /#\/?([^\?]+)(\?.+)?/;
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

    /**
     * Checks for a match between a registered (possibly parameterized)
     * route and another route. Returns false if there isn't a match and
     * an object containing match information if there is.
     * @param {string} registered - The registered and possibly
     * parameterized route to check against for a match.
     * @param {string} passed - The route to check against a registered
     * route for a match.
     * @return {bool|object} - False if there is no match and an object
     * containing params and score properties if there is. The params
     * property contains an object with key/value pairs derived from
     * route parameterization, and the score property contains a number
     * indicating the degree of parameterization.
     */
    function routeMatch(registered, passed) {
      var params = {};
      var score = 0;

      // Pieces of the registered route.
      var registeredPieces = registered.split('/');

      // Pieces of the passed route.
      var passedPieces = passed.split('/');
      // Trim an empty string at the end if present.
      // (Handles the edge-case: 'blog/'.)
      if (passedPieces.length > 1 && passedPieces[passedPieces.length - 1] === '') {
        passedPieces = passedPieces.slice(0, passedPieces.length - 1);
      }

      // If the registered and passed routes contain different numbers
      // of pieces, they are not a match,
      if (registeredPieces.length !== passedPieces.length) {
        return false;
      }

      var i;
      var len = registeredPieces.length;
      var key;
      var val;

      // For each piece...
      for (i = 0; i < len; i++) {
        // If the pieces match, proceed to the next piece.
        if (registeredPieces[i] === passedPieces[i]) {
          continue;
        }

        // If the piece is parameterized update the params and score
        // values, then proceed to the next piece.
        if (registeredPieces[i][0] === ':') {
          key = registeredPieces[i].slice(1);
          val = passedPieces[i];

          params[key] = val;
          score++;
          continue;
        }

        // If neither of the above, the routes are not a match.
        return false;
      }

      return {
        params: params,
        score: score
      };
    }
  }
})();
