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
    var htmlTemplate;

    self.refresh = refresh;
    self.render = render;

    init();

    /*
    ****************************************
    * Exposed methods.
    ****************************************
    */

    /**
     * Refreshes the view (but does not render).
     * @param {object} data - Data used to refresh the view.
     * @param {Post[]} data.posts - Posts to display in the view.
     */
    function refresh(data) {
      var posts = data.posts
        .map(function(post) {
          return formatPostTemplate(post);
        })
        .join('');

      htmlTemplate = document.getElementById('blog-template').innerHTML;
      htmlTemplate = htmlTemplate.replace('{posts}', posts);
    }

    /**
     * Renders HTML to the document.
     */
    function render() {
      // Get the element in which to render content.
      var el = document.querySelector('.main');
      // Set the element's content.
      el.innerHTML = htmlTemplate;
    }

    /*
    ****************************************
    * Private methods.
    ****************************************
    */

    /**
     * Initializes the blog view.
     */
    function init() {
      var data = {
        posts: blogController.getPosts()
      }
      refresh(data);
    }

    /**
     * Formats a post template with data from a post.
     * @param {Post} post - The post used to format the template.
     * @return {string} - The formatted template.
     */
    function formatPostTemplate(post) {
      var template = document.getElementById('post-template').innerHTML;

      // Formate piece template.
      template = template
        .replace('{title}', post.title)
        .replace('{content}', post.content)
        .replace('{date}', post.date.toLocaleDateString())
        .replace('{iso-date}', post.date.toISOString())
        .replace('{subtitle}', post.subtitle ?
                               '<p class="post__subtitle">' +
                               post.subtitle +
                               '</p>'
                               : '')
        .replace('{tags}', post.tags ? post.tags.join(', ') : '');

      return template;
    }
  }
})();
