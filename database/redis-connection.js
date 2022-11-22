const redis = require("redis");
const Log = require("../log");
const client = redis.createClient({
	socket: {
		host: "redis-11844.c302.asia-northeast1-1.gce.cloud.redislabs.com",
		port: "11844",
	},
	password: "Xhl3ENh5O3gyKqiObVUCX9xqXmE2L0AK",
});
client.on("connect", function (err) {
	if (err) {
		Log.error("Error occured while connecting to redis server");
	} else {
		Log.info("connected to Redis!!");
	}
});
client.on("error", function (err) {
	if (err) {
		Log.error(err);
	}
});

async function disconnectRedis() {
	await new Promise((resolve, reject) => {
		client.quit(() => {
			resolve();
		});
	});
}
module.exports = {
	client,
	disconnectRedis,
};
