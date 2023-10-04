const { Router } = require("express");

const GuildsController = require("../controllers/GuildsController");

const guildsRoutes = Router();

const guildsController = new GuildsController();

guildsRoutes.post("/", guildsController.create);
guildsRoutes.put("/:guild_id", guildsController.update);
guildsRoutes.get("/:guild_id", guildsController.show);
guildsRoutes.get("/", guildsController.showAll);


module.exports = guildsRoutes;