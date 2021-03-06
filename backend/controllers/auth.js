const User = require("../Models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.signup = async (req, res, next) => {
	const { username, email, password } = req.body;
	try {
		const user = await User.create({
			username,
			email,
			password,
		});
		sendToken(user, 201, res);
	} catch (error) {
		next(error);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;

	// Check if email and password is provided
	if (!email || !password) {
		return next(new ErrorResponse("Please provide an email and password", 400));
	}

	try {
		// Check that user exists by email
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}

		// Check that password match
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return next(new ErrorResponse("Invalid credentials", 401));
		}

		sendToken(user, 200, res);
	} catch (error) {
		next(error);
	}
};

exports.edit = async (req, res, next) => {
	const { username, toEdit } = req.body;

	try {
		const user = await User.findOneAndUpdate({ username }, toEdit, {
			new: true,
		});

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

exports.get = async (req, res, next) => {
	let { username, fields } = req.body;
	if (fields === undefined) {
		fields = "";
	}
	try {
		const user = await User.findOne({ username }).select(fields);

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		next(error);
	}
};

const sendToken = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedToken();

	res.status(statusCode).json({
		success: true,
		token,
	});
};
