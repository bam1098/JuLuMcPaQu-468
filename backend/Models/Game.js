const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema(
	{
		timeControl: {
			type: String,
			required: [true, "Time control not supplied"],
		},
		playerWhite: {
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: [true, "Player ID not supplied"],
			},
			username: {
				type: String,
				required: [true, "Player username not supplied"],
			},
		},
		playerBlack: {
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: [true, "Player ID not supplied"],
			},
			username: {
				type: String,
				required: [true, "Player username not supplied"],
			},
		},
		winner: {
			_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: [true, "Winner ID not supplied"],
			},
			username: {
				type: String,
				required: [true, "Winner username not supplied"],
			},
		},
		draw: {
			type: Boolean,
			default: false,
		},
		date: {
			type: mongoose.Schema.Types.Date,
			required: [true, "Date not supplied"],
		},
		turns: {
			type: Number,
			required: [true, "Turn count must be supplied"],
		},
		history: {
			type: String,
			required: [true, "Match history must be specified"],
		},
	},
	{
		collection: "Games",
	}
);

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;
