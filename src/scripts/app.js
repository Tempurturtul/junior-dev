// app.js
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  window.addEventListener('load', init);

  function init() {
    var mainController = new app.controllers.MainController();
    mainController.init();
  }
})();

/******************************************************************************
* STAGING (Will be moved to separate files.)
******************************************************************************/

// Router.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.Router = Router;

  /**
   * A minimal hash router.
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


    /***************************************
    * Exposed methods.
    ***************************************/

    function registerRoute(route, handler) {}

    function unregisterRoute(route) {}

    function suspend() {}

    function unsuspend(andCheckRoute) {}

    function start() {
      unsuspend(true);
    }

    /***************************************
    * Private methods.
    ***************************************/

    /**
     * Parses a location hash to retrieve route and params properties, where
     * params is an object with key/value pairs extracted from a query string.
     * @param {string} locationHash - The location hash to parse.
     * @returns {object} - The parsed results, containing `route` and
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
     * @returns {object} - The parsed results, containing a key/value pair for
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

            // If both values are arrays, concatenate them.
            if (Array.isArray(prevVal) && Array.isArray(val)) {
              val = prevVal.concat(val);
            }
            // If one value is an array, append or prepend to the array.
            else if (Array.isArray(prevVal) && !Array.isArray(val)) {
              val = prevVal.push(val);
            }
            else if (!Array.isArray(prevVal) && Array.isArray(val)) {
              val = val.unshift(prevVal);
            }
            // If neither are arrays, create a new array.
            else {
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


/***********************
* Models
***********************/

// PortfolioPiece.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.PortfolioPiece = PortfolioPiece;

  function PortfolioPiece(data) {
    this.liveURL = data.liveURL;
    this.sourceURL = data.sourceURL;
    this.images = data.images;
    this.title = data.title;
    this.description = data.description;
  }
})();

// Post.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.Post = Post;

  function Post(data) {
    this.title = data.title;
    this.content = data.content;
    this.tags = data.tags;
    this.date = data.date;
  }
})();


/***********************
* Controllers
***********************/

// MainController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.MainController = MainController;

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


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    /**
     * Initializes the main controller.
     */
    function init() {
      blogController = new app.controllers.blogController(self);
      homeController = new app.controllers.homeController(self);
      portfolioController = new app.controllers.portfolioController(self);
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

  function BlogController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.blogView = null;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {
      self.blogView = new app.views.blogView(self);
    }

  }
})();

// HomeController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.HomeController = HomeController;

  function HomeController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.homeView = null;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {
      self.homeView = new app.views.homeView(self);
    }

  }
})();

// PortfolioController.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.controllers = app.controllers || {};
  app.controllers.PortfolioController = PortfolioController;

  function PortfolioController(mainController) {
    var self = this;

    // Assigned on initialization.
    self.portfolioView = null;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {
      self.portfolioView = new app.views.portfolioView(self);
    }

  }
})();

/***********************
* Views
***********************/

// BlogView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.BlogView = BlogView;

  function BlogView(blogController) {
    var self = this;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {}

  }
})();

// HomeView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.HomeView = HomeView;

  function homeView(homeController) {
    var self = this;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {}

  }
})();

// PortfolioView.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.views = app.views || {};
  app.views.PortfolioView = PortfolioView;

  function PortfolioView(portfolioController) {
    var self = this;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/



    /***************************************
    * Private methods.
    ***************************************/

    function init() {}

  }
})();
