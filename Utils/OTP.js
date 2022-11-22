require("dotenv").config();
const twilioClient = require("twilio")(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);
const Log = require("../log");
const { client } = require("../database");

/**
 *
 * @param {String} key  stored key in cach
 * @param {String} number user phone number
 * @returns
 */
function sendMessage(key, number) {
	Log.info(key);
	/*
	 * send Key to given number using twilio api
	 */
	return new Promise((res, rej) => {
		twilioClient.messages.create(
			{
				from: process.env.TWILIO_PHONE_NUMBER,
				to: number,
				body: ` رمز التحقق من تسجيل الدخول الخاص بك هو ${key} :`,
			},
			function (err, message) {
				if (err) {
					Log.error(err);
					rej(err);
				}
				res(message);
			}
		);
	});
}

/**
 *
 * @param {String} PhoneNumber
 * @description generate randome 6 degit key && store in redis cash
 * @returns return the stored key
 */
async function generateKeyAndstoreOtp(PhoneNumber) {
	// generate randome 6 degit key
	const key = Math.floor(Math.random() * 9000) + 1000;
	// store in redis cash
	await client.set(PhoneNumber, key);
	//return the stored key
	return key;
}
module.exports = { sendMessage, generateKeyAndstoreOtp };
