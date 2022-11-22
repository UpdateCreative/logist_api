const Router = require("express").Router();
const controller = require("../controllers/file.controller");

Router.post("/upload", controller.upload);
Router.get("/", controller.getListFiles);
Router.get("/:name", controller.download);

module.exports = Router;
