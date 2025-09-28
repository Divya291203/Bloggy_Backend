import multer from "multer";

//Configure Multer storage

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			cb(null, "uploads/");
		} catch (error) {
			cb(new Error("Failed to create upload directory"), null);
		}
	},
	filename: function (req, file, cb) {
		try {
			cb(null, `${Date.now()}-${file.originalname}`);
		} catch (error) {
			cb(new Error("Failed to create filename"), null);
		}
	},
});

//File filter
const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error("Invalid file type, only JPEG, PNG and JPG are allowed"),
			false
		);
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB limit
	},
});
