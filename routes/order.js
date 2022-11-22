const Router = require("express").Router();
const {
	Order,
	AcceptOrder,
	CancelOrder,
	CompleteOrder,
	UpdateLocation,
	DriversToDeliver,
	OrderStatus,
} = require("../controllers/Order");
Router.post("/", Order);
Router.post("/AcceptOrder", AcceptOrder);
Router.post("/CancelOrder", CancelOrder);
Router.post("/CompleteOrder", CompleteOrder);
Router.post("/UpdateLocation", UpdateLocation);
Router.get("/GetOrderStatus", OrderStatus);
Router.get("/DriversToDeliver", DriversToDeliver);

module.exports = Router;
