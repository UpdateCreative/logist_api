const { client: Redis } = require("../database/index");
const { GetUserById } = require("./user");
const { Mysql, Query } = require("../database/index.js");
const { Orders } = require("../controllers/User");

let OrderRooms = [];
let users = [];

const AddUser = (id) => {
	users.push({
		socketId: client.id,
		userId: userId,
	});
};
const RemoveUser = (client) => {
	users = users.filter((user) => user.socketId !== client.id);
};

const GetUserOrders = (id) => {
	const Orders =
		Query(`select OrderTable.*, driver.id ,user_table.full_name as 'Driver Name'
    ,l_Distination.latitude as 'Distination_lat' ,  l_Distination.longitude as "Distination_long"
    ,l_location.latitude as 'location_lat' ,  l_location.longitude as "location_long"
    ,l_Current_Location.latitude as 'Current_Location.lat' ,  l_Current_Location.longitude as "Current_Location_long"
            from OrderTable 
            inner join location l_Distination on (l_Distination.id = OrderTable.Distination)
            inner join location l_location on (l_location.id = OrderTable.location)
            inner join location l_Current_Location on (l_Current_Location.id = OrderTable.Current_Location)
            inner join driver  on (driver.id = OrderTable.Driver_ID)
            inner join user_table  on (user_table.id = driver.user_id)
            where OrderTable.user_id = ${id}`);
	return Orders;
};
class WebSockets {
	io;
	constructor(io) {
		this.io = io;
	}
	connection(client) {
		client.emit("Connect", "Connected To Socket");

		// event fired when the chat room is disconnected
		client.on("disconnect", () => {
			RemoveUser(client);
		});
		// add identity of user mapped to the socket id
		client.on("identity", async (user) => {
			AddUser(user.userId);
		});
	}
	OrderConnection(client) {
		client.emit("success", "You have Connected to Order nameSpace");

		// add identity of user mapped to the socket id
		client.on("JoinOrderRoom", async (Obj) => {
			const { UserId, RoomID } = Obj;
			OrderRooms = GetUserOrders(UserId);
			if (OrderRooms.includes(RoomID)) {
				client.join(RoomID);
				return client.emit("success", "Joined");
			} else {
				return client.emit("err", "Order Error");
			}
		});

		client.on("onChanged", (Obj) => {
			const { room } = Obj;
			client.to(room).emit("onChanged", Obj);
		});

		client.on("Order", (Obj) => {
			//Subscribe Driver TO Room If Connected
			subscribeOtherUser(Obj.OrderID, Obj.DriverId);

			//Brodcast new Order
			this.io.to(Obj.OrderID).emit("newOrder", Obj);
		});

		// event fired when the chat room is disconnected
		client.on("disconnect", () => {
			// RemoveUser(client);
		});
	}
	ChatConnection(client) {
		client.emit("Connect", "Connected To Chat Socket");
		// event fired when the chat room is disconnected
		client.on("disconnect", () => {
			RemoveUser(client);
		});
		// add identity of user mapped to the socket id
		client.on("identity", async (user) => {
			AddUser(user.userId);
		});
		client.on("JoinRoom", (Obj) => {
			const { UserId, RoomID } = Obj;
			Orders = GetUserOrders(UserId);
			try {
				client.join(RoomID);
				return client.emit("success", `Joined Chat Room ${Obj.id}`);
			} catch (err) {
				return client.emit("err", err);
			}
		});
		client.on("onChanged", (Obj) => {
			const { room } = Obj;
			client.to(room).emit("onChanged", Obj);
		});
	}
	// check if other user is online if so make him join to room
	subscribeOtherUser(room, otherUserId) {
		const userSockets = users.filter((user) => user.userId === otherUserId);
		userSockets.map((userInfo) => {
			const socketConn = this.io.sockets.connected(userInfo.socketId);
			if (socketConn) {
				socketConn.join(room);
			}
		});
	}
}

module.exports = WebSockets;
