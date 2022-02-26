const Game = require("../models/Game");
const ErrorResponse = require("../utils/errorResponse");

exports.save = async (req, res, next) => {
	const { playerWhite, playerBlack, winner, draw, date, turns, history } =
		req.body;
	try {
		const game = await Game.create({
			playerWhite,
			playerBlack,
			winner,
			draw,
			date,
			turns,
			history,
		});
		const _id = game._id;
		res.status(201).json({
			success: true,
			_id,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};

exports.getAllUser = async (req, res, next) => {
	const { idList } = req.body;
	try {
		const games = await Game.find({
			_id: { $in: idList },
		});
		res.status(200).json({
			success: true,
			games,
		});
	} catch (err) {
		next(new ErrorResponse(err.message, 500));
	}
};
