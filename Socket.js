const OrderRooms = [1, 2, 3, 4, 5, 6];

function Connect(server) {
	const io = require("socket.io")(server);
	io.of("/Orders").on("connection", (socket) => {
		console.log("Connect ORder");
		socket.emit("Welcome", "Hello TO Logist");

		socket.on("JoinRoom", (room) => {
			if (OrderRooms.includes(room)) {
				socket.join(room);
				return socket.emit("success", "Joined");
			} else {
				return socket.emit("err", "Error");
			}
		});
	});
}
