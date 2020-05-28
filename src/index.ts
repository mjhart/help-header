import onHeaders = require("on-headers");
import { RequestHandler, Response } from "express";
import { ServerResponse } from "http";

interface HelpHeaderConfig {
  [statusCode: number]: URL | string;
  informational?: URL | string;
  successful?: URL | string;
  redirection?: URL | string;
  clientError?: URL | string;
  serverError?: URL | string;
}

/**
 * Create a middleware to add a `Link` header to any response with a status code matching the
 * provided config object.
 */
function helpHeader(config: HelpHeaderConfig): RequestHandler {
  function getHelpUrl(statusCode: number): URL | string | undefined {
    if (statusCode in config) {
      return config[statusCode];
    }
    if (statusCode >= 100 && statusCode < 200) {
      return config.informational;
    }
    if (statusCode < 300) {
      return config.successful;
    }
    if (statusCode < 400) {
      return config.redirection;
    }
    if (statusCode < 500) {
      return config.clientError;
    }
    if (statusCode < 600) {
      return config.serverError;
    }

    // unrecognized status code
    return undefined;
  }

  function addLinkHeader(this: ServerResponse): void {
    const helpUrl = getHelpUrl(this.statusCode);
    if (typeof helpUrl === "undefined") {
      return;
    }

    const res = this as Response;

    if (typeof helpUrl === "string") {
      try {
        const parsedUrl = new URL(helpUrl);
        res.links({ help: parsedUrl.toString() });
      } catch (_) {}
    } else {
      res.links({ help: helpUrl.toString() });
    }
  }

  return (req, res, next) => {
    onHeaders(res, addLinkHeader);
    next();
  };
}

export { helpHeader };
