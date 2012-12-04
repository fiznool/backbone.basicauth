/*!
 * backbone.basicauth.js v0.1.0
 * Copyright 2012, Tom Spencer (@fiznool)
 * backbone.basicauth.js may be freely distributed under the MIT license.
 */
 ;(function(window) {

  // Local copy of global variables
  var _ = window._;
  var Backbone = window.Backbone;
  var btoa = window.btoa;
  
  var token;

  var encode = function(username, password) {
    // Use Base64 encoding to create the authentication details
    // If btoa is not available on your target browser there is a polyfill:
    // https://github.com/davidchambers/Base64.js
    return btoa(username + ':' + password);
  };

  // Store a copy of the original Backbone.sync
  var originalSync = Backbone.sync;
  
  Backbone.BasicAuth = {
    // Setup Basic Authentication for all future requests
    set: function(username, password) {
      token = encode(username, password);

      // Override Backbone.sync for all future requests,
      // setting the Basic Auth header before the sync is performed.
      Backbone.sync = function(method, model, options) {
        options.headers = options.headers || {};
        _.extend(options.headers, { 'Authorization': 'Basic ' + token });
        return originalSync.call(model, method, model, options);
      };
    },

    // Clear Basic Authentication for all future requests
    clear: function() {
      token = null;
      Backbone.sync = originalSync;
    }
  };

})(this);