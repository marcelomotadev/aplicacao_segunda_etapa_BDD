const { Router } = require("express");

const PlayersController = require("../controllers/PlayersController");

const playersRoutes = Router();

const playersController = new PlayersController();

playersRoutes.post("/", playersController.create);
playersRoutes.put("/:player_id", playersController.update);
playersRoutes.get("/:player_id", playersController.show);
playersRoutes.put("/:player_id/leave-guild", playersController.leaveGuild);
playersRoutes.put("/:player_id/enter-guild", playersController.leaveGuild);

module.exports = playersRoutes;