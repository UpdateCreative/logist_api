const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "google-cloud-key.json" });
const bucket = storage.bucket("logist-358612.appspot.com");

const UploadFile = (filepath) => {
	return new Promise((res, rej) => {
		try {
			const blob = bucket.file(filepath);
			const blobStream = blob.createWriteStream({
				resumable: false,
			});

			blobStream.on("error", (err) => {
				rej({ message: err.message });
			});

			blobStream.on("finish", async (data) => {
				const publicUrl = format(
					`https://storage.googleapis.com/${bucket.name}/${blob.name}`
				);

				try {
					await bucket.file(filepath).makePublic();
				} catch {
					return rej({
						message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
						url: publicUrl,
					});
				}

				res({
					message: "Uploaded the file successfully: " + filepath,
					url: publicUrl,
				});
			});

			blobStream.end(req.file.buffer);
		} catch (err) {
			console.log(err);

			if (err.code == "LIMIT_FILE_SIZE") {
				rej({
					message: "File size cannot be larger than 2MB!",
				});
			}

			rej({
				message: `Could not upload the file: ${filepath}. ${err}`,
			});
		}
	});
};

module.exports = { UploadFile };
