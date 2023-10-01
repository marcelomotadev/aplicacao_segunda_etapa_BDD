const { Router } = require("express");

const playersRouter  = require('./player.routes');
const pertenceRouter = require('./pertence.routes');
const guildsRouter = require('./guild.routes');

const routes = Router();

routes.use("/player", playersRouter);
routes.use("/pertence", pertenceRouter);
routes.use("/guilds", guildsRouter);

module.exports = routes;