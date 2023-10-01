const { Router } = require("express");

const playersRouter  = require('./player.routes');

const routes = Router();

routes.use("/player", playersRouter);

module.exports = routes;