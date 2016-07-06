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
   * @param {string} [data.subtitle] - The subtitle of the post.
   * @param {string[]} [data.tags] - The post's tags.
   */
  function Post(data) {
    this.title = data.title;
    this.content = data.content;
    this.date = data.date;
    this.subtitle = data.subtitle || null;
    this.tags = data.tags || [];
  }
})();
