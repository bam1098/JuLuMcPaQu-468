const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			minlength: 3,
			required: [true, "Please enter a username"],
			unique: [true, "Username already exists"],
		},
		email: {
			type: String,
			required: [true, "Please enter an email"],
			unique: [true, "An account with this email already exists"],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: 8,
			select: false,
		},
		wins: {
			type: Number,
			default: 0,
		},
		losses: {
			type: Number,
			default: 0,
		},
		draws: {
			type: Number,
			default: 0,
		},
		matchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
	},
	{
		collection: "Users",
	}
);

UserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedToken = function () {
	return jwt.sign(
		{ id: this._id, username: this.username },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRE,
		}
	);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
