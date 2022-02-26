const express = require("express");
const gameRoutes = express.Router();

const { save, getAllUser, get } = require("../controllers/game");

// This section will help save a game.
gameRoutes.route("/save").post(save);

// This section will help find a user's games.
gameRoutes.route("/getAllUser").post(getAllUser);

// This section will help get a specific game.
gameRoutes.route("/get").post(get);

module.exports = gameRoutes;
