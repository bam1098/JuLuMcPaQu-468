const express = require("express");

// userRoutes is an instance of the express router.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

const { signup, login, edit } = require("../controllers/auth");

// This section will help create a new user.
userRoutes.route("/user/signup").post(signup);

// This section will help login a user.
userRoutes.route("/user/login").post(login);

// This section will help edit a user.
userRoutes.route("/user/edit").post(edit);

module.exports = userRoutes;
