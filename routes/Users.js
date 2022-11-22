const Router = require("express").Router();
const {
	GetUser,
	UpdateUser,
	GetUsers,
	UpdatePhoneNumber,
	SendOtp,
	Orders,
} = require("../controllers/User");

Router.get("/", GetUser);
Router.post("/", UpdateUser);
Router.get("/Users", GetUsers);
Router.post("/SendOtp", SendOtp);
Router.post("/UpdatePhoneNumber", UpdatePhoneNumber);
Router.get("/GetOrders", Orders);
module.exports = Router;
