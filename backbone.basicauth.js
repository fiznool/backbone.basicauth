/*!
 * backbone.basicauth.js v0.3.0
 *
 * Automatically parses the model/collection.url for http auth credentials
 *
 * Copyright 2013, Tom Spencer (@fiznool), Luis Abreu (@lmjabreu)
 * backbone.basicauth.js may be freely distributed under the MIT license.
 */
;( function (root, factory) {
  // AMD module if available
  if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root._, root.Backbone);
    }
}( this, function (_, Backbone) {

  var btoa = window.btoa;

  /**
   * Returns a base64 encoded "user:pass" string
   * @param  {string} username The http auth username
   * @param  {string} password The http auth password
   * @return {string}          The base64 encoded credentials pair
   */
  var encode = function encodeToken (username, password) {
    // Use Base64 encoding to create the authentication details
    // If btoa is not available on your target browser there is a polyfill:
    // https://github.com/davidchambers/Base64.js
    return btoa([username, password].join(':'));
  };

  // Store a copy of the original Backbone.sync
  var originalSync = Backbone.sync;

  /**
   * Override Backbone.sync
   *
   * If a token is present, set the Basic Auth header before the sync is performed.
   *
   * @param  {string} method  Contains the backbone operation. e.g.: read, reset, set
   * @param  {object} model   A Backbone model or collection
   * @param  {object} options Options to be passed over to Backbone.sync and jQuery
   * @return {object}         Reference to Backbone.sync for chaining
   */
  Backbone.sync = function (method, model, options) {
    // Handle both string and function urls
    var remoteURL = _.result(model, 'url');

    // Retrieve the auth credentials from the model url
    var credentials = remoteURL.match(/\/\/(.*):(.*)@/),
        token;

    // Set the token if available
    if (credentials && credentials.length === 3) {
      token = encode(credentials[1], credentials[2]);
    }

    // Add the token to the request headers if available
    if (token != null) {
      options.headers = options.headers || {};
      _.extend(options.headers, { 'Authorization': 'Basic ' + token });
    }

    // Perform the sync
    return originalSync.call(model, method, model, options);
  };

}));
