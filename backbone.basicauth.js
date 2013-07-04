/*!
 * backbone.basicauth.js v0.3.0
 *
 * Automatically parses the model/collection.url for http auth credentials
 *
 * Copyright 2013, Tom Spencer (@fiznool), Luis Abreu (@lmjabreu)
 * backbone.basicauth.js may be freely distributed under the MIT license.
 */
;( function ( root, factory ) {
  // AMD module if available
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'BackboneBasicAuth', [ 'Underscore', 'Backbone' ], function BackboneBasicAuthDefineCallback ( Underscore, Backbone ) {
      factory( root, Underscore, Backbone );
    } );
  } else {
    // Browser global scope
    factory( root );
  }
}( this, function BackboneBasicAuthFactory ( window, Underscore, BBone ) {

  var _ = Underscore || window._;
  var Backbone = BBone || window.Backbone;
  var btoa = window.btoa;

  /**
   * Returns a base64 encoded "user:pass" string
   * @param  {string} username The http auth username
   * @param  {string} password The http auth password
   * @return {string}          The base64 encoded credentials pair
   */
  var encode = function encodeToken ( username, password ) {
    // Use Base64 encoding to create the authentication details
    // If btoa is not available on your target browser there is a polyfill:
    // https://github.com/davidchambers/Base64.js
    return btoa( [ username, password ].join( ':' ) );
  };

  /**
   * Override Backbone.*.prototype.sync
   *
   * If a token is present, set the Basic Auth header before the sync is performed.
   *
   * @param  {string} method  Contains the backbone operation. e.g.: read, reset, set
   * @param  {object} context A Backbone model or collection
   * @param  {object} options Options to be passed over to Backbone.sync and jQuery
   * @return {object}         Reference to Backbone.sync for chaining
   */
  Backbone.Collection.prototype.sync = Backbone.Model.prototype.sync = function backboneSyncOverride ( method, context, options ) {
    // Handle both string and function urls
    var remoteURL = ( _.isFunction( context.url ) ) ? context.url() : context.url ;
    // Retrieve the auth credentials from the context url
    var credentials = remoteURL.match( /\/\/(.*):(.*)@/ ),
        token;
    // Set the token if available
    if ( credentials && credentials.length === 3 ) {
      token = encode( credentials[ 1 ], credentials[ 2 ] );
    }
    // Add the token to the request headers if available
    if ( typeof token !== 'undefined' && token !== null ) {
      options.headers = options.headers || {};
      _.extend( options.headers, { 'Authorization': 'Basic ' + token } );
    }

    // Perform the sync
    return Backbone.sync.apply( this, arguments );
  };

} ) );
