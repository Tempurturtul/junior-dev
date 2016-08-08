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
   * @param {string} [data.created] - The post's creation date.
   * @param {string} [data.modified] - The post's last modified date.
   * @param {string} [data.content] - The post's content.
   * @param {string[]} [data.tags] - The post's tags.
   */
  function Post(data) {
    // Initialize data in the event that none is given.
    data = data || {};

    this.title = data.title;
    this.subtitle = data.subtitle;
    this.created = data.created ? new Date(data.created) : undefined;
    this.modified = data.modified ? new Date(data.modified) : undefined;
    this.content = data.content;
    this.tags = data.tags;
  }
})();
