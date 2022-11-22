const { Mysql, SqlQuery } = require("../database/index.js");
const { BadRequestError } = require("../errors");
const Log = require("../log");

const AddViecle = async (req, res) => {
	const { _name, _dec, _pic } = req.body;
	try {
		const Added = SqlQuery(
			`Insert into vehicle(_name, _dec, _pic) values ('${_name}, ${_dec}, ${_pic}')`
		);
		res.status(200).send(Added.data.rows.insertId);
	} catch (err) {
		throw new BadRequestError(`could not add vehicle by the id => ${id}`);
	}
};

const Viecles = async (req, res) => {
	try {
		const Viecles = SqlQuery("Select * from vehicle");
		res.json(Viecles);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};
const Viecle = async (req, res) => {
	const { _name, id } = req.body;
	const Query =
		id == null || id == undefined
			? `Select * from vehicle where _name =  ${_name}`
			: `Select * from vehicle where id =  ${id}`;
	try {
		const vehicle = SqlQuery(Query);
		res.json(vehicle);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};

const Trailers = async (req, res) => {
	try {
		const traillers = SqlQuery("Select * from trailler");
		res.json(traillers);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};
const Trailer = async (req, res) => {
	const { _name, id } = req.query;
	const Query =
		id == null || id == undefined
			? `Select * from trailler where _name =  ${_name}`
			: `Select * from trailler where id =  ${id}`;
	try {
		const trailler = SqlQuery(Query);
		res.json(trailler);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};
const AddTrailers = async (req, res) => {
	const { _name, _dec, _pic } = req.body;
	try {
		const Added = SqlQuery(
			`Insert into trailler(_name, _dec, _pic) values ('${_name}, ${_dec}, ${_pic}')`
		);
		res.status(200).send(Added.data.rows.insertId);
	} catch (err) {
		throw new BadRequestError(`could not add vehicle by the id => ${id}`);
	}
};

const TrailersType = async (req, res) => {
	try {
		const trailler_types = SqlQuery(`Select * from trailler_types`);
		res.json(trailler_types);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};
const TrailerType = async (req, res) => {
	const { _name, id } = req.query;
	const Query =
		id == null || id == undefined
			? `Select * from trailler_types where _name =  ${_name}`
			: `Select * from trailler_types where id =  ${id}`;
	try {
		const traillers_types = SqlQuery(Query);
		res.json(traillers_types);
	} catch (err) {
		throw new BadRequestError("Could not Retrive Your Request");
	}
};

const AddTrailerType = async (req, res) => {
	const { _name, _dec, _pic } = req.body;
	try {
		const Added = SqlQuery(
			`Insert into trailler_types(_name, _dec, _pic) values ('${_name}, ${_dec}, ${_pic}')`
		);
		res.status(200).send(Added.data.rows.insertId);
	} catch (err) {
		throw new BadRequestError(`could not add trailler_types `);
	}
};
module.exports = {
	AddViecle,
	Viecles,
	Trailers,
	Trailer,
	TrailerType,
	TrailersType,
	AddTrailerType,
	AddTrailers,
};
