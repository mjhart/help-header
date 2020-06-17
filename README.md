# help-header

Help-header is an [express](https://expressjs.com/) middleware module that adds `Link` headers to
responses matching configured status codes. It is useful for linking error responses to your
documentation to aid your API consumers in diagnosing errors. For example:

```shell script
$ curl -i https://api.example.com/authorized_resource
HTTP/2 401
Content-Type: application/json; charset=utf-8
...
Link: <https://example.com/docs/authorization>; rel="help"
...
```

## Installation

The package (with types) is available on npm. Install with
[npm install](https://docs.npmjs.com/downloading-and-installing-packages-locally):

```shell script
$ npm install help-header
```

## Usage

See [express documentation](https://expressjs.com/en/guide/using-middleware.html) for how to
install middleware.

## Configuration

A configuration object must be provided which tells help-header what status codes to match and what
URLs to link to. URLs can be linked by any combination of status family and code. When processing a
response, help-header first tries to match by status code, then by family. So for example, to link
all `4XX` response to general documentation and `403` status codes specifically to your
authorization documentation, you may use something like:

```javascript
const express = require('express');
const helpHeader = require('help-header').helpHeader;

const app = express();
app.use(
  helpHeader({
    401: "http://example.com/docs/authorization",
    clientError: "http://example.com/docs",
  })
);
```

The keys in the config object must be a number or one of:

* `informational`
* `successful`
* `redirection`
* `clientError`
* `serverError`

The values must be strings encoding valid URLs or URL objects.
