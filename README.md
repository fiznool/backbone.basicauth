# Backbone Basic Auth plugin

This plugin enables access to remote resources which are protected by [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) through your Backbone Models and Collections.

## Modes

You can set Basic Authentication credentials in two ways:

 - Directly on the model/collection `url` property.
 - Via a separate model/collection property: `basicAuthCredentials`.

### URL mode

Usage:

``` js
var Model = Backbone.Model.extend({
  url: 'http://username:password@path/to/basic/auth/protected/resource'
});

var model = new Model();
model.fetch();
```

This mode is good for simple models where the username/password is unlikely to change, e.g. a fixed API key for your app. The plugin takes care of parsing the URL to create the necessary Basic Authentication header, and jQuery removes the `username:password@` portion of the URL so your username and password isn't sent to the server on the URL.

Thanks goes to [Luis Abreu](https://github.com/lmjabreu) for his work implementing this.

### Function mode

Usage:

``` js
var Model = Backbone.Model.extend({
  url: 'http://path/to/basic/auth/protected/resource'
});

var model = new Model();
model.basicAuthCredentials = {
	username: 'user',
	password: 'pass'
};

// or ...
model.basicAuthCredentials = function() {
	return {
		username: 'user',
		password: 'pass'
	};
};

model.fetch();
```

This mode is good for authentication that may change when the app is used, e.g. if different users log in to the app. The credentials can be set at run-time instead of being hard coded on the URL.

It is possible to emulate this mode using the URL-based approach above (by using some String replacement to inject the `username:password@` into the URL) but this approach is often easier.

## How does it work?

A resource protected with HTTP Basic Authentication requires the following HTTP header to be set on every request:

```
Authorization: Basic <accesstoken>
```

The access token is formed by taking the username and password, concatenating together with a `:` separator and encoding into Base64.

This plugin handles the Base64 encoding and automatically sets the `Authorization` header on every request which uses `Backbone.sync`.

## Creating header for use elsewhere

On occasion, it can be useful to bypass `Backbone.sync` and use raw `$.ajax` (for example, when hitting server API resources which do not conform to RESTful principles). More information on this subject can be found in [this excellent blog post by Derick Bailey](http://lostechies.com/derickbailey/2012/05/04/wrapping-ajax-in-a-thin-command-framework-for-backbone-apps/).

If you need/want to do this, there is a convenience function which will help you build the BasicAuth header: `Backbone.BasicAuth.getHeader()`, which can be used to create the header to be set directly on the AJAX request.

Example:

``` js
// Pass the credentials to the plugin to build the header
$.ajax({
  method: 'GET',
  dataType: "json",
  url: 'http://path/to/basic/auth/protected/resource',
  headers: Backbone.BasicAuth.getHeader({
  	username: 'user',
  	password: 'pass'
	})
});

```

## Dependencies

 - [Backbone](http://backbonejs.org)
 - [Underscore](http://underscorejs.org) or [Lodash](http://lodash.com)
 - JavaScript [`btoa()`](https://developer.mozilla.org/en-US/docs/DOM/window.btoa) function (a [polyfill](https://github.com/davidchambers/Base64.js) is available if `btoa()` is not supported in your target browser)

## Server-side

The idea of this plugin is to adhere to the standard [HTTP Basic Authentication](http://www.ietf.org/rfc/rfc2617.txt) scheme. There is bound to be a 'basic' way to read the username / password combination in your chosen server-side language.

[See here for a PHP example.](http://php.net/manual/en/features.http-auth.php)

## Change Log

### v0.4.0 (23rd July 2013)

- Re-introduced concept of setting Basic Auth credentials in a function, in addition to URL-based method.

### v0.3.0 (22nd July 2013)

 - Moved to use the standard method of HTTP Basic Authentication, by adding `username:password` to the URL string. The old method of setting the Basic Auth token (`Backbone.BasicAuth.set` / `Backbone.BasicAuth.remove`) has now been removed from the codebase. Thanks to [Luis Abreu](https://github.com/lmjabreu) for the PR.
 - Added AMD support (thanks again [Luis Abreu](https://github.com/lmjabreu)).

### v0.2.0 (1st May 2013)

 - Added Bower support.

## License

Copyright 2013, Tom Spencer (@fiznool), Luis Abreu (@lmjabreu).

backbone.basicauth.js may be freely distributed under the MIT license.
