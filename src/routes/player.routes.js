const { Router } = require("express");

const PlayersController = require("../controllers/PlayersController");

const playersRoutes = Router();

const playersController = new PlayersController();

playersRoutes.post("/", playersController.create);
// playersRoutes.get("/:cpf", playersController.show);

module.exports = playersRoutes;