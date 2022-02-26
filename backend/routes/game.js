const express = require("express");
const gameRoutes = express.Router();

const { save, getAllUser } = require("../controllers/game");

// This section will help save a game.
gameRoutes.route("/save").post(save);

// This section will help find a user's games.
gameRoutes.route("/getAllUser").post(getAllUser);
module.exports = gameRoutes;
