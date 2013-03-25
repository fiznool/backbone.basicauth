# Backbone Basic Auth plugin

This plugin enables access to remote resources which are protected by [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) through your Backbone Models and Collections.

Usage:

``` js
var Model = Backbone.Model.extend({
  url: 'http://path/to/basic/auth/protected/resource'
});

Backbone.BasicAuth.set('username', 'password');

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

## API

#### `Backbone.BasicAuth.set(username, password)`

Sets the access token which is used by all future remote requests, until `clear()` is called.

#### `Backbone.BasicAuth.clear()`

Clears the access token and restores the standard `Backbone.sync`.

## Dependencies

 - [Backbone](http://backbonejs.org)
 - JavaScript [`btoa()`](https://developer.mozilla.org/en-US/docs/DOM/window.btoa) function (a [polyfill](https://github.com/davidchambers/Base64.js) is available if `btoa()` is not supported in your target browser)

## Server-side

The idea of this plugin is to adhere to the standard [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) scheme. There is bound to be a 'basic' way to read the username / password combination in your chosen server-side language.

[See here for a PHP example.](http://php.net/manual/en/features.http-auth.php)
