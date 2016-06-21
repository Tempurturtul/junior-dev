// app.js
(function() {
  'use strict';

  // Get or initialize the app's global object.
  var app = window.app = window.app || {};

  window.addEventListener('load', init);

  function init() {
    var mainController = new app.controllers.MainController();
    window.addEventListener('hashchange', mainController.setView(window.location.hash));
  }
})();

/******************************************************************************
* STAGING (Will be moved to separate files.)
******************************************************************************/

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
    // Defined routes. (A preceding colon indicates a key/value pair.)
    var routes = [
      '',
      'blog',
      'blog/:post',
      'home',
      'portfolio'
    ];

    self.setView = setView;

    init();


    /***************************************
    * Exposed methods.
    ***************************************/

    /**
     * Sets the view based on the route and query string in the location hash.
     * @param {string} locationHash - The location hash used to set the view.
     */
    function setView(locationHash) {

    }


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

      var result = str;

      // Trim the preceding '?' if present.
      if (result[0] === '?') {
        result = result.slice(1);
      }

      // Split into an array of key/value pairs.
      result = result.split('&');

      // Transform the array.
      result = result
        // Filter out empty entries. (Handles the edge-cases: '?foo=bar&&baz=qux' and '?'.)
        .filter(function(pair) {
          // (I'm being explicit here; could just return pair.)
          return pair.length !== 0;
        })
        // Map the strings to objects.
        .map(function(pair) {
          var obj = {};

          pair = pair.split('=');
          var key = pair[0];
          var value = pair[1] || null;

          // If value contains comma separated entries...
          if (/,/.test(value)) {
            // Convert value to an array.
            value = value.split(',');
          }

          obj[key] = value;

          return obj;
        });

      return result;
    }

    /**
     * Parses a location hash to retrieve route and query string properties.
     * @param {string} locationHash - The location hash to parse.
     * @returns {object} - The parsed results, containing `route` and
     * `queryStr` properties.
     */
    function parseLocationHash(locationHash) {
      // A regular expression capturing the route and query string.
      // Example:
      //   #/(route/somewhere)(?foo=1)
      var re = /#\/?([^\?\n]+)(\?.+)?/;
      var results = re.exec(locationHash) || [];

      var route = results[1] || '';
      var queryStr = results[2] || '';

      return {
        route: route,
        queryStr: queryStr
      };
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
