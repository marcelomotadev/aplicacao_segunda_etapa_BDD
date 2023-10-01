const { Router } = require('express')

const PertenceController = require('../controllers/PertenceController')

const pertenceRoutes = Router()

const pertenceController = new PertenceController()

pertenceRoutes.get('/', pertenceController.show)
pertenceRoutes.put('/:player_id/:guild_id', pertenceController.update)

module.exports = pertenceRoutes
