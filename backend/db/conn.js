const mongoose = require("mongoose");

const connectDB = async () => {
	await mongoose.connect(process.env.ATLAS_URI, {
		dbName: "ChessGame",
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log("MongoDB Connected!");
};

module.exports = connectDB;
