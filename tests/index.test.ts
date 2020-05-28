import express from "express";
import { helpHeader } from "../src";
import request from "supertest";

it("matches on status code before status family", async () => {
  const app = express();
  app.use(
    helpHeader({
      403: "http://example.com/docs/authorization",
      clientError: "http://example.com/docs",
    })
  );
  app.get("/test", (req, res) => res.sendStatus(403));

  const res = await request(app).get("/test").send();

  expect(res.links).toMatchObject({
    help: "http://example.com/docs/authorization",
  });
});

it("falls back to status family", async () => {
  const app = express();
  app.use(
    helpHeader({
      403: "http://example.com/docs/authorization",
      clientError: "http://example.com/docs",
    })
  );
  app.get("/test", (req, res) => res.sendStatus(400));

  const res = await request(app).get("/test").send();

  expect(res.links).toMatchObject({ help: "http://example.com/docs" });
});

it("omits header response status code doesn't match a URL in config", async () => {
  const app = express();
  app.use(
    helpHeader({
      403: "http://example.com/docs/authorization",
      clientError: "http://example.com/docs",
    })
  );
  app.get("/test", (req, res) => res.sendStatus(200));

  const res = await request(app).get("/test").send();

  expect(res.links).not.toHaveProperty("help");
});

it("omits header if string not parsable as URL", async () => {
  const app = express();
  app.use(
    helpHeader({
      clientError: "not a URL",
    })
  );
  app.get("/test", (req, res) => {
    res.sendStatus(400);
  });

  const res = await request(app).get("/test").send();

  expect(res.links).toEqual({});
});

it("can be used with URL objects in config", async () => {
  const app = express();
  app.use(
    helpHeader({
      403: new URL("http://example.com/docs/authorization"),
      clientError: new URL("http://example.com/docs"),
    })
  );
  app.get("/test", (req, res) => res.sendStatus(403));

  const res = await request(app).get("/test").send();

  expect(res.links).toMatchObject({
    help: "http://example.com/docs/authorization",
  });
});

it("adds header if error thrown", async () => {
  const app = express();
  app.use(
    helpHeader({
      serverError: "http://example.com/bugs",
    })
  );
  app.get("/test", () => {
    throw new Error("something went wrong!");
  });

  const res = await request(app).get("/test").send();

  expect(res.links).toMatchObject({
    help: "http://example.com/bugs",
  });
});
