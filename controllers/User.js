const { Mysql, Query, SqlQuery } = require("../database/index.js");
const Log = require("../log");
const { sendMessage, generateKeyAndstoreOtp } = require("../Utils/OTP");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { GetUserById } = require("../Utils/user");
const { client } = require("../database");

const GetUser = async (req, res) => {
	const { id: UserId } = req.user;
	const user = SqlQuery("select * from user_table where id = " + UserId);
	if (!user.success) return res.status(404).send("User not found");
	if (user.data.rows.length === 0) {
		return res.status(200).send({
			id: 0,
			full_name: "",
			phone_number: "",
		});
	}
	res.status(200).send(JSON.stringify(user.data.rows[0]));
};

const GetUsers = async (req, res) => {
	const users = Query(`select * from user_table`);
	res.status(200).send(users);
};
const Orders = async (req, res) => {
	const { id: UserId } = req.user;

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
            where OrderTable.user_id = ${UserId}`);

	res.status(200).send(Orders);
};

const UpdateUser = async (req, res) => {
	const { id: UserId } = req.user;
	const user = await GetUserById(UserId);
	const updateRes = Query(
		`update user_table set full_name =${user.full_name} , adrress=${user.adress} ,email=${user.email}`
	);
	res.sendStatus(200);
};

const GetDrivers = async (req, res) => {
	const { id: UserId } = req.user;
	const Driver = SqlQuery("select * from user_table where id = " + UserId);

	if (!Driver.success) return res.status(404).send("User not found");

	if (Driver.data.rows.length === 0)
		return res.status(404).send("User not found");

	let DriverObj = Driver.data.rows[0];

	let drivers_trailers_type = GetDriverTrailers(DriverObj.id);
	let drivers_trailler = GetDriverTrailers(DriverObj.id);

	DriverObj["TrailerIds"] = drivers_trailler;
	DriverObj["TrailerTypeIds"] = drivers_trailers_type;

	res.status(200).send(JSON.stringify(DriverObj));
};

async function GetDriverTrailersType(id) {
	let TrailersType = [];
	const Driver_trailler_type = SqlQuery(
		"select * from drivers_trailler_type where driver_id = " + id
	);
	if (Driver_trailler_type.success) {
		Driver_trailler_type.data.rows.map((element) => {
			TrailersType.push(element.id);
		});
	}
	return TrailersType;
}

async function GetDriverTrailers(id) {
	let drivers_trailler = [];
	const drivers_trailler_sql = SqlQuery(
		"select * from drivers_trailler where driver_id = " + id
	);
	if (drivers_trailler_sql.success) {
		drivers_trailler_sql.data.rows.map((element) => {
			drivers_trailler.push(element.id);
		});
	}
	return drivers_trailler;
}

const UpdatePhoneNumber = async (req, res) => {
	const { phonenumber, Otp } = req.body;
	const Stored_Otp = await client.get(phonenumber);
	if (Stored_Otp !== Otp) throw new BadRequestError("Entred otp not valide");
	const user = Query(`update user_table set phone_number = ${phonenumber}`);
	res.status(200).send(user);
};

const SendOtp = async (req, res) => {
	const { id } = req.user;
	const user = await GetUserById(id);
	try {
		sendMessage(generateKeyAndstoreOtp(user.phone_number), user.phone_number);
		res.sendStatus(200);
	} catch (err) {
		throw new BadRequestError(err);
	}
};

module.exports = {
	GetUser,
	GetUsers,
	UpdateUser,
	UpdatePhoneNumber,
	SendOtp,
	Orders,
};
