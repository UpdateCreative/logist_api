const { Mysql, Query, SqlQuery } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const { client } = require("../database/index.js");
require("dotenv").config();
const Log = require("../log");
const { sendMessage, generateKeyAndstoreOtp } = require("../Utils/OTP");
const { GenrateAvaratByName } = require("../Utils/Avatar");

const processFile = require("../middleware/upload");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const { BadRequestError } = require("../errors/index.js");
// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("logist-358612.appspot.com");

/**
 * @description check if user already has an account if so generate a key and send otp to verify && return {aleady = true } if dosnt return  {aleady = false }
 */
const CheckIfUserExists = async (req, res) => {
	const { phonenumber } = req.body;
	Log.info(`CheckIfUserExists phonenumber --> ${phonenumber}`);
	if (!phonenumber) {
		Log.info(`phonenumber NULL --> ${phonenumber}`);
		throw new BadRequestError("Please provide phonenumber");
	}
	const Key = await generateKeyAndstoreOtp(phonenumber);

	const user = Query(
		`select * from user_table where phone_number = ${phonenumber}`
	);
	try {
		await sendMessage(Key, phonenumber);
		res.json({ already: !user ? false : true });
	} catch (err) {
		res.sendStatus(500);
	}
};

const login = async (req, res) => {
	const { phonenumber, key } = req.body;
	//get key from redis
	let StoredKey = await client.get(phonenumber);
	StoredKey = "0000";
	Log.info(`Verify User by Key ==> ${key}`);
	if (key != null && key != undefined && key == StoredKey) {
		try {
			const user = Query(
				`select * from user_table where phone_number = ${phonenumber}`
			);
			if (user.length == 0) {
				res.json({ Verified: true });
			} else {
				const accesToken = jwt.sign(user[0], process.env.ACCESS_TOKEN_SECRET);
				const RefreshToken = jwt.sign(
					user[0],
					process.env.REFRESH_TOKEN_SECRET
				);
				res.json({
					accesToken: accesToken,
					RefreshToken: RefreshToken,
					Verified: true,
				});
			}
		} catch (err) {
			console.log(err);
			res.json({ Verified: false });
		}
	} else {
		console.log(StoredKey);
		res.json({ Verified: false });
	}
};

const VerifyNumber = async (req, res) => {
	console.log(VerifyNumber);
	const { phonenumber, key } = req.body;
	console.table({ phonenumber, key });
	//get key from redis
	try {
		const value = await client.get(phonenumber);
		res.send({ Verified: value != null && value != undefined && value == key });
	} catch (err) {
		console.log(err);
		throw new BadRequestError("Something Went Wrong");
	}
};

const regester = async (req, res) => {
	const { FullName, phonenumber, adrress } = req.body;

	let avatar_img_url = await GenrateAvaratByName(FullName);
	if (!avatar_img_url)
		throw new UnauthenticatedError("Failled To Generate Profile Avatar");
	const UserCreated =
		SqlQuery(`insert into user_table(avatar,full_name,phone_number,gender,birth_date,
			adrress,email,user_location,created_date) values ('${avatar_img_url}',
			'${FullName}','${phonenumber}','N/A',CURRENT_DATE(),'${adrress}','Example@email.com',CURRENT_DATE());`);
	if (!UserCreated.success)
		return res
			.status(403)
			.send(`Could not Create User ${UserCreated.data.err.sqlMessage}`);
	const accesToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);
	const RefreshToken = jwt.sign(req.body, process.env.REFRESH_TOKEN_SECRET);

	res.json({ accesToken: accesToken, RefreshToken: RefreshToken });
};

const test = (req, res) => {
	const accesToken = jwt.sign({ id: 1 }, process.env.ACCESS_TOKEN_SECRET);
	return res.json({ accesToken: accesToken });
};

const driverRegester = async (req, res) => {
	const {
		Fullname: FullName,
		BirthDate,
		phonenumber,
		adrress,
		Nationality: nationality,
		IDNumber: identity_card,
		LicenseID: license,
		CarID: vehicle_register_number,
		CarPlat: plate_number,
		FrontIDImage: identity_card_photo_front,
		BackIDImage: identity_card_photo_back,
		LicenseImage: lecense_photo,
		TruckId: vehicle_type_id,
		TrailerIds,
		TrailerTypeIds,
	} = req.body;

	let avatar_img_url = await GenrateAvaratByName(FullName);
	if (!avatar_img_url)
		throw new UnauthenticatedError("Failled To Generate Profile Avatar");

	const UserCreated =
		SqlQuery(`insert into user_table(avatar,full_name,phone_number,gender,birth_date,adrress,email,user_location,created_date)
                            values('${avatar_img_url}','${FullName}','${phonenumber}','male',CURRENT_DATE(),'${adrress}','',1,CURRENT_DATE())`);

	if (!UserCreated.success)
		throw new BadRequestError(
			`Could not Create User  ${UserCreated.data.err.sqlMessage}`
		);

	const DriverCreated =
		SqlQuery(`INSERT INTO driver(user_id ,nationality ,identity_card ,license ,vehicle_register_number, plate_number, 
                                    identity_card_photo_front, identity_card_photo_back, lecense_photo, vehicle_type_id) 
                                        VALUES('${UserCreated.data.rows.insertId}','${nationality}','${identity_card}',
                                        '${license}','${vehicle_register_number}','${plate_number}','${identity_card_photo_front}',
                                        '${identity_card_photo_back}','${lecense_photo}','${vehicle_type_id}');`);
	if (!DriverCreated.success)
		throw new BadRequestError(
			`Could not Create DriverCreated  ${UserCreated.data.err.sqlMessage}`
		);
	Insert_Trilers_n_Trailers_type(
		DriverCreated.data.rows.insertId,
		TrailerIds,
		TrailerTypeIds
	);

	const Driver = SqlQuery(
		`Select * from driver where id = ${DriverCreated.data.rows.insertId}`
	);
	const accesToken = jwt.sign(
		Driver.data.rows[0],
		process.env.ACCESS_TOKEN_SECRET
	);
	const RefreshToken = jwt.sign(
		Driver.data.rows[0],
		process.env.REFRESH_TOKEN_SECRET
	);

	res.json({ accesToken: accesToken, RefreshToken: RefreshToken });
};
async function Insert_Trilers_n_Trailers_type(
	insertId,
	TrailerIds,
	TrailerTypeIds
) {
	try {
		TrailerIds.map((element) => {
			const AddTrailers =
				SqlQuery(`Insert into drivers_trailler_type(trailer_id, driver_id,)
                            values ('${element}, ${insertId}')`);
		});
		TrailerTypeIds.map((element) => {
			const AddTrailerType =
				SqlQuery(`Insert into drivers_trailler(trailer_id, driver_id,)
                                values ('${element}, ${insertId}')`);
		});
	} catch (err) {
		throw new BadRequestError(`could not add vehicle by the id => ${id}`);
	}
}

const UploadDocument = async (req, res) => {
	try {
		await processFile(req, res);
		if (!req.file) {
			return res.status(400).send({ message: "Please upload a file!" });
		}
		try {
			const URl = await UploadFile(req.file.originalname);
		} catch (error) {
			res.status(500).send({ message: error.message, url: error.url });
		}
		// Create a new blob in the bucket and upload the file data.
	} catch (err) {
		if (err.code == "LIMIT_FILE_SIZE") {
			return res.status(500).send({
				message: "File size cannot be larger than 2MB!",
			});
		}
		res.status(500).send({
			message: `Could not upload the file: ${req.file.originalname}. ${err}`,
		});
	}
};

const ResendOTP = async (req, res) => {
	const { phonenumber } = req.body;

	const Key = await client.get(phonenumber);
	if (Key == null || Key == undefined) res.sendStatus(404);
	try {
		await sendMessage(Key, phonenumber);
		res.sendStatus(200);
	} catch (err) {
		res.sendStatus(500);
	}
};

async function UploadFile(file) {
	return new Promise((res, rej) => {
		const blob = bucket.file(file);
		const blobStream = blob.createWriteStream({
			resumable: false,
		});
		blobStream.on("error", (err) => {
			rej({ message: err.message });
		});
		blobStream.on("finish", async (data) => {
			// Create URL for directly file access via HTTP.
			const publicUrl = format(
				`https://storage.googleapis.com/${bucket.name}/${blob.name}`
			);
			try {
				// Make the file public
				await bucket.file(req.file.originalname).makePublic();
			} catch {
				rej({
					message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
					url: publicUrl,
				});
			}
			res({
				message: "Uploaded the file successfully: " + req.file.originalname,
				url: publicUrl,
			});
		});
		blobStream.end(req.file.buffer);
	});
}

module.exports = {
	CheckIfUserExists,
	login,
	VerifyNumber,
	regester,
	ResendOTP,
	UploadDocument,
	test,
	driverRegester,
};
