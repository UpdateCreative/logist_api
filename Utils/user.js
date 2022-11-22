const { BadRequestError, UnauthenticatedError } = require("../errors");
const { Mysql, Query } = require("../database/index.js");

const GetUserById = async (id) => {
	const user = Query(`select * from user_table where id = ${id}`);
	if (!user)
		throw new BadRequestError(`could not Retrive User by this ID => ${id}`);
	return user[0];
};
module.exports = { GetUserById };
