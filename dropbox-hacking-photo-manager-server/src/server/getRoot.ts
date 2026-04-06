import { Application } from "express";

export default (app: Application): void => {
  app.get("/", (_, res) => {
    res.redirect(301, "http://localhost:4001/");
    res.end();
  });
};
