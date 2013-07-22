# Backbone Basic Auth plugin

This plugin enables access to remote resources which are protected by [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) through your Backbone Models and Collections.

Usage:

``` js
var Model = Backbone.Model.extend({
  url: 'http://username:password@path/to/basic/auth/protected/resource'
});

var model = new Model();
model.fetch();
```

## How does it work?

A resource protected with HTTP Basic Authentication requires the following HTTP header to be set on every request:

```
Authorization: Basic <accesstoken>
```

The access token is formed by taking the username and password, concatenating together with a `:` separator and encoding into Base64.

This plugin handles the Base64 encoding and automatically sets the `Authorization` header on every request which uses `Backbone.sync`.

## Dependencies

 - [Backbone](http://backbonejs.org)
 - JavaScript [`btoa()`](https://developer.mozilla.org/en-US/docs/DOM/window.btoa) function (a [polyfill](https://github.com/davidchambers/Base64.js) is available if `btoa()` is not supported in your target browser)

## Server-side

The idea of this plugin is to adhere to the standard [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) scheme. There is bound to be a 'basic' way to read the username / password combination in your chosen server-side language.

[See here for a PHP example.](http://php.net/manual/en/features.http-auth.php)

## Change Log

### v0.3.0 (22nd July 2013)

 - Moved to use the standard method of HTTP Basic Authentication, by adding username:password to the URL string. The old method of setting the Basic Auth token (`Backbone.BasicAuth.set` / `Backbone.BasicAuth.remove`) has now been removed from the codebase. Thanks to [https://github.com/lmjabreu](Luis Abreu) for the PR.
 - Added AMD support (thanks again [https://github.com/lmjabreu](Luis Abreu)).

 ### v0.2.0 (1st May 2013)

  - Added Bower support.