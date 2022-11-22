const express = require("express");
const app = express();
const Log = require("./log/index");
const { client } = require("./database/index");
const http = require("http");
/** Create HTTP server. */
const server = http.createServer(app);
const socketio = require("socket.io")(server);

require("express-async-errors");
// const Socket = require('./Socket');
// socket configuration
const Sockets = require("./utils/WebSockets.js");
const WebSockets = new Sockets(socketio);

//  routers
const Auth = require("./routes/Auth");
const User = require("./routes/Users");
const Viecle = require("./routes/Viecles");
const Order = require("./routes/order");
const review = require("./routes/review");
const Messenger = require("./routes/Messenger");
const Files = require("./routes/Files");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/Auth/auth");

app.use(express.json());
app.use(express.static("./public"));
client.connect();

app.use("/api/v1/auth", Auth);
app.use("/api/v1/user", authenticationMiddleware, User);
app.use("/api/v1/order", authenticationMiddleware, Order);
app.use("/api/v1/review", authenticationMiddleware, review);
app.use("/api/v1/messenger", authenticationMiddleware, Messenger);
app.use("/api/v1/files", authenticationMiddleware, Files);
app.use("/api/v1/viecles", authenticationMiddleware, Viecle);
app.use("/api/v1/Statics", authenticationMiddleware, Viecle);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8000;

/** Create socket connection */
let appServer;
socketio.listen(server);
socketio.on("connection", WebSockets.connection);
socketio.of("/Order").on("connection", WebSockets.OrderConnection);
socketio.of("/Chat").on("connection", WebSockets.ChatConnection);

const start = () => {
	try {
		appServer = server.listen(PORT, () => {
			Log.info(`App Running on port => ${PORT}`);
		});
	} catch (error) {
		Log.error(`App Stopped by an Error => ${error}`);
	}
};

start();
module.exports = appServer;
