// Post.js
(function() {
  'use strict';

  var app = window.app = window.app || {};
  app.models = app.models || {};
  app.models.Post = Post;

  /**
   * Creates a new Post.
   * @constructor
   * @param {object} [data] - Data representing the post.
   * @param {string} [data.title] - The title of the post.
   * @param {string} [data.subtitle] - The subtitle of the post.
   * @param {string} [data.date] - The post's last updated date.
   * @param {string} [data.content] - The post's content.
   * @param {string[]} [data.tags] - The post's tags.
   */
  function Post(data) {
    // Initialize data in the event that none is given.
    data = data || {};

    this.title = data.title;
    this.subtitle = data.subtitle;
    this.date = data.date ? new Date(data.date) : undefined;
    this.content = data.content;
    this.tags = data.tags;
  }
})();
