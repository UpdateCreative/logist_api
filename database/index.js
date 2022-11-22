const { Mysql, Query, SqlQuery } = require("./mysql-connection");
const { client, disconnectRedis } = require("./redis-connection");
module.exports = {
	Mysql,
	client,
	disconnectRedis,
	Query,
	SqlQuery,
};
