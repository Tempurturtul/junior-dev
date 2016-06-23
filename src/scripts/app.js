// app.js
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  window.addEventListener('load', init);

  /**
   * Initializes the application.
   */
  function init() {
    var mainController = new app.controllers.MainController();
    mainController.init();
  }
})();

/*
*******************************************************************************
* STAGING (Will be moved to separate files.)
*******************************************************************************
*/

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

/*
************************
* Models
************************
*/

// PortfolioPiece.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.PortfolioPiece = PortfolioPiece;

  /**
   * Creates a new Portfolio Piece.
   * @constructor
   * @param {object} data - Data representing the portfolio piece.
   * @param {string} data.title - The title of the piece.
   * @param {string} [data.liveURL] - A URL to a live version of the piece.
   * @param {string} [data.sourceURL] - A URL to the piece's source code.
   * @param {object[]} [data.images] - A collection of images of the portfolio
   * piece, including image size.
   * @param {string} [data.description] - A description of the piece.
   */
  function PortfolioPiece(data) {
    this.title = data.title;
    this.liveURL = data.liveURL || '';
    this.sourceURL = data.sourceURL || '';
    this.images = data.images || [];
    this.description = data.description || '';
  }
})();

// Post.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.Post = Post;

  /**
   * Creates a new Post.
   * @constructor
   * @param {object} data - Data representing the post.
   * @param {string} data.title - The title of the post.
   * @param {string} data.content - The post's content.
   * @param {Date} data.date - The post's last updated date.
   * @param {string[]} [data.tags] - The post's tags.
   */
  function Post(data) {
    this.title = data.title;
    this.content = data.content;
    this.date = data.date;
    this.tags = data.tags || [];
  }
})();

/*
************************
* Controllers
************************
*/

// MainController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.MainController = MainController;

  /**
   * Creates a new Main Controller.
   * @constructor
   */
  function MainController() {
    var self = this;
    // Child controllers, assigned on initialization.
    var blogController;
    var homeController;
    var portfolioController;
    // Router, assigned on initialization.
    var router;
    // Routes to define. (A preceding colon indicates a key/value pair to be passed as a parameter.)
    var routes = [
      {
        route: '',
        handler: homeController.setView
      },
      {
        route: 'blog',
        handler: blogController.setView
      },
      {
        route: 'blog/:post',
        handler: blogController.setView
      },
      {
        route: 'home',
        handler: homeController.setView
      },
      {
        route: 'portfolio',
        handler: portfolioController.setView
      }
    ];

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the main controller.
     */
    function init() {
      blogController = new app.controllers.BlogController(self);
      homeController = new app.controllers.HomeController(self);
      portfolioController = new app.controllers.PortfolioController(self);
      router = new app.Router();

      // Register the routes.
      routes.forEach(function(entry) {
        router.registerRoute(entry.route, entry.handler);
      });

      // Start the router (handles the current route).
      router.start();
    }
  }
})();

// BlogController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.BlogController = BlogController;

  /**
   * Creates a new Blog Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function BlogController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.blogView = null;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog controller.
     */
    function init() {
      self.blogView = new app.views.BlogView(self);
    }
  }
})();

// HomeController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.HomeController = HomeController;

  /**
   * Creates a new Home Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function HomeController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.homeView = null;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the home controller.
     */
    function init() {
      self.homeView = new app.views.HomeView(self);
    }
  }
})();

// PortfolioController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.PortfolioController = PortfolioController;

  /**
   * Creates a new Portfolio Controller.
   * @constructor
   * @param {MainController} mainController - The parent controller.
   */
  function PortfolioController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.portfolioView = null;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio controller.
     */
    function init() {
      self.portfolioView = new app.views.PortfolioView(self);
    }
  }
})();

/*
************************
* Views
************************
*/

// BlogView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.BlogView = BlogView;

  /**
   * Creates a new Blog View.
   * @constructor
   * @param {BlogController} blogController - The view's controller.
   */
  function BlogView(blogController) {
    var self = this;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog view.
     */
    function init() {}
  }
})();

// HomeView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.HomeView = HomeView;

  /**
   * Creates a new Home View.
   * @constructor
   * @param {HomeController} homeController - The view's controller.
   */
  function HomeView(homeController) {
    var self = this;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the home view.
     */
    function init() {}
  }
})();

// PortfolioView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.PortfolioView = PortfolioView;

  /**
   * Creates a new Portfolio View.
   * @constructor
   * @param {PortfolioController} portfolioController - The view's controller.
   */
  function PortfolioView(portfolioController) {
    var self = this;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the portfolio view.
     */
    function init() {}
  }
})();
