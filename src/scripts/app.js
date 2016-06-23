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
