const { BadRequestError } = require("../errors");

const { Query, SqlQuery } = require("../database/index");
const Log = require("../log");
const Order = async (req, res) => {
	const { id: UserId } = req.user;
	const {
		Driver_ID,
		Date_of_Order,
		Distination,
		location,
		viecle_Id,
		trailer_id,
		Current_Location,
		Order_Type,
		Order_Start_Time,
	} = req.body;
	try {
		const Distinationid = Query(
			`INSERT INTO location(latitude,longitude)values(${Distination.lant},${Distination.long});`
		).insertId;
		const locationid = Query(
			`INSERT INTO location(latitude,longitude)values(${location.lant},${location.long});`
		).insertId;
		const Current_Locationid = Query(
			`INSERT INTO location(latitude,longitude)values(${Current_Location.lant},${Current_Location.long});`
		).insertId;
		const order =
			SqlQuery(`INSERT INTO OrderTable(Driver_ID,user_id,Date_of_Order,Distination,location,
            Accepted,Canceled,viecle_Id,trailer_id,Current_Location,Order_Type,Order_Complited,Order_Start_Time) 
            VALUES(${Driver_ID},${UserId},'${Date_of_Order}','${Distinationid}','${locationid}',0,0,${viecle_Id},${trailer_id},'${Current_Locationid}',
            '${Order_Type}',0,'${Order_Start_Time}');`);

		if (!order.success) {
			console.log(order);
			return res
				.status(400)
				.send(`Could not Place The order  ${updated.data.err.sqlMessage}`);
		}
		res.status(200).send({ id: order.data.rows.insertId });
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const AcceptOrder = async (req, res) => {
	const { id } = req.body;
	try {
		const updated = SqlQuery(`
                        update OrderTable set Accepted = true where id = $ { id }
                        `);
		if (!updated.success)
			throw new BadRequestError(`
                        Could not CancelOrder The order $ { updated.data.err.sqlMessage }
                        `);
		res.status(200).send("OK");
	} catch (err) {
		throw new BadRequestError(`
                        could not Accept The Order $ { err }
                        `);
	}
};

const CancelOrder = async (req, res) => {
	const { id } = req.body;
	try {
		const updated = SqlQuery(`
                        update OrderTable set Canceled = true where id = $ { id }
                        `);
		if (!updated.success)
			throw new BadRequestError(`
                        Could not CancelOrder The order $ { updated.data.err.sqlMessage }
                        `);
		res.status(200).send("OK");
	} catch (err) {
		throw new BadRequestError("could not Accept The Order");
	}
};

const OrderStatus = async (req, res) => {
	const { id } = req.body;
	let OrderObj;
	try {
		const orderStatus = Query(`
                        select * from OrderTable where id = ${id}
                        `);
		if (orderStatus.length == 0) return res.sendStatus(404);
		OrderObj = orderStatus[0];
		OrderObj["Status"] = OrderObj.Order_Complited
			? "Delivered"
			: OrderObj.Accepted
			? "Accepted"
			: OrderObj.Canceled
			? "Canceled"
			: "Pending";
		res.send(OrderObj);
	} catch (err) {
		throw new BadRequestError("Order Not Found");
	}
};

const CompleteOrder = async (req, res) => {
	const { id } = req.body;
	try {
		const updated = SqlQuery(`
                        update OrderTable set Order_Complited = true where id = ${id}
                        `);
		if (!updated.success)
			throw new BadRequestError(`
                        Could not CompleteOrder The order ${updated.data.err.sqlMessage}
                        `);
		res.status(200).send("OK");
	} catch (err) {
		throw new BadRequestError("could not Accept The Order");
	}
};

const UpdateLocation = async (req, res) => {
	const { location, id } = req.body;
	try {
		const locationid = Query(`
                        INSERT INTO location(latitude, longitude) values(${location.lant}, ${location.long});
                        `).insertId;
		const updated = SqlQuery(`
                        update OrderTable set location = '${locationid}'
                        where id = $ { id }
                        `);
		console.log(updated);
		if (!updated.success)
			throw new BadRequestError(`
                        Could not UpdateLocation The order ${updated.data.err.sqlMessage}
                        `);
		res.status(200).send("OK");
	} catch (err) {
		throw new BadRequestError(err);
	}
};

const DriversToDeliver = async (req, res) => {
	const { lan, lon, Range } = req.body;
	let SelectedDrivers = [];

	try {
		const drivers = Query(`
                        SELECT * from driver INNER JOIN user_table ON user_table.id = driver.user_id INNER JOIN location on location.id = user_table.user_location `);
		if (!drivers.success)
			throw new BadRequestError("could not get DriversToDeliver ");
		drivers.map((items) => {
			if (
				distanceInKmBetweenEarthCoordinates(
					items.latitude,
					items.longitude,
					lan,
					lon
				) <= Range
			) {
				SelectedDrivers.push(items);
			}
		});
		SelectedDrivers.sort((a, b) => (a.Rating > b.Rating ? 1 : -1));
		res.status(200).json(SelectedDrivers);
	} catch (err) {
		throw new BadRequestError("could not get DriversToDeliver ");
	}
};

/**
 *
 * @param {*} degrees
 * @returns
 */
function degreesToRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

/**
 *
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @returns
 */
function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
	var earthRadiusKm = 6371;

	var dLat = degreesToRadians(lat2 - lat1);
	var dLon = degreesToRadians(lon2 - lon1);

	lat1 = degreesToRadians(lat1);
	lat2 = degreesToRadians(lat2);

	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadiusKm * c;
}

module.exports = {
	Order,
	AcceptOrder,
	CancelOrder,
	CompleteOrder,
	UpdateLocation,
	DriversToDeliver,
	OrderStatus,
};
