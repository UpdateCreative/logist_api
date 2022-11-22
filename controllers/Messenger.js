const { Mysql, Query, SqlQuery } = require("../database/index.js");
const { BadRequestError } = require("../errors");

const getRoomInfo = (id) => {
	return new Promise((resolve, rejects) => {
		const Room = SqlQuery(
			`select full_name , avatar from user_table
			 where id = ${id}`
		);
		if (!Room.success) {
			rejects("Could Not Retrive the Room");
		}
		resolve(Room.data.rows[0]);
	});
};

const LoopAllRoms = async (Roms, id) => {
	let Roms_info = [];
	for (let Rom of Roms) {
		let item;
		try {
			item = await getRoomInfo(
				Rom.user_id == id ? Rom.receiverId : Rom.user_id
			);
		} catch (err) {
			throw new BadRequestError(err);
		}
		Roms_info.push({
			receiverId: Rom.receiverId,
			SenderId: Rom.user_id,
			lastMessage: Rom.lastMessage,
			seen: Rom.seen,
			unseenNumber: Rom.unseenNumber,
			Hash: Rom.Hash,
			name: item.full_name,
			profileImage: item.avatar,
		});
	}
	return Roms_info;
};

const ChatRoms = async (req, res) => {
	const Chat_Room = SqlQuery(
		`select * from inbox where user_id =${req.query.id} or receiverId =${req.query.id};`
	);
	if (!Chat_Room.success) {
		throw new BadRequestError("Error");
	}
	const data = await LoopAllRoms(rows, req.query.id);
	res.send(data);
};

const Chat = (req, res) => {
	const Hash_id = req.query.Hash_id;
	const SenderId = req.query.SenderId;
	const receiverId = req.query.receiverId;
	let Query =
		Hash_id == null || Hash_id == undefined || Hash_id == ""
			? `select id ,DATE_FORMAT(sendTime, '%H:%i') as sendTime , DATE_FORMAT(readTime, '%H:%i') as readTime ,
					contentImage,contentText,contentAudio,SenderId,Delete_id,Hash_id,message.CallsDuration 
					from message where Hash_id= ${Hash_id};`
			: `select message.id , DATE_FORMAT(message.sendTime, '%H:%i') as sendTime , DATE_FORMAT(message.readTime, '%H:%i') as readTime 
					,message.contentImage,message.contentText,message.contentAudio,message.SenderId,message.Delete_id,message.Hash_id 
					,message.CallsDuration from message inner join inbox on message.Hash_id=inbox.Hash
						where (user_id = ${SenderId} or receiverId = ${SenderId}) and (user_id = ${receiverId} or receiverId = ${receiverId})`;
	let msg = SqlQuery(Query);
	if (!msg.success) throw new BadRequestError("Error");
	res.send(msg.data.rows);
};

const Read = (req, res) => {
	const inbox = SqlQuery(
		`update inbox set unseenNumber= 0 , seen=true where Hash =${req.body.Hash_id};`
	);
	if (!inbox.success) throw new BadRequestError("Error");
	res.sendStatus(200);
};

const Send = (req, res) => {
	let Hash_id =
		req.body.Hash_id == null || req.body.Hash_id == undefined
			? ""
			: req.body.Hash_id;

	let CallDuration =
		req.body.CallsDuration == null || req.body.CallsDuration == undefined
			? 0
			: req.body.CallsDuration;

	const SendMesage =
		SqlQuery(`call SendMesage(${req.body.contentImage},${req.body.contentText},
					${req.body.contentAudio},${req.body.SenderId},
					${req.body.receiverId},${Hash_id},
						${CallDuration});`);

	if (!SendMesage.success) {
		throw new BadRequestError("Error");
	}
	res.status(200).send(Rows);
};
module.exports = { ChatRoms, Chat, Read, Send };
