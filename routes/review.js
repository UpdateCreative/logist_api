const Router = require("express").Router();
const { AddReview, Reviews } = require("../controllers/review");

Router.post("/Reviews", Reviews);
Router.post("/AddReview", AddReview);

module.exports = Router;
