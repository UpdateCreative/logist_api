const Router = require("express").Router();
const {
	AddViecle,
	Viecles,
	Trailers,
	Trailer,
	TrailerType,
	TrailersType,
	AddTrailerType,
	AddTrailers,
} = require("../controllers/viecles");

Router.route("/").get(Viecles).post(AddViecle);
Router.route("/Trailers").get(Trailers).post(AddTrailers);
Router.get("/Trailer", Trailer);
Router.get("/TrailerType", TrailersType);
Router.route("/TrailerTypes").get(TrailerType).post(AddTrailerType);
module.exports = Router;
