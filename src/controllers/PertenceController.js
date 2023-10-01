const AppError = require('../Utils/AppError')
const sqliteConnection = require('../database/sqlite')

class PertenceController {
  async create(request, response) {
    const { playerd_id, guild_id, cargo } = request.body

    const database = await sqliteConnection()

    const checkPertenceExists = await database.get(
      'SELECT * FROM pertence WHERE playerd_id = (?) AND guild_id = (?)',
      [playerd_id, guild_id]
    )

    if (checkPertenceExists) {
      throw new AppError('Esse player já pertence a esta guild')
    }

    await database.run(
      'INSERT INTO pertence (playerd_id, guild_id, cargo) VALUES (?, ?, ?)',
      [playerd_id, guild_id, cargo]
    )

    return response
      .status(201)
      .json(`Player: ${playerd_id} agora pertence a guild: ${guild_id}.`)
  }

  async show(request, response) {
    const { playerd_id, guild_id } = request.params

    const database = await sqliteConnection()

    const pertence = await database.get(
      'SELECT * FROM pertence WHERE playerd_id = (?) AND guild_id = (?)',
      [playerd_id, guild_id]
    )

    if (!pertence) {
      throw new AppError('Pertencimento não encontrado no banco de dados')
    }

    return response.status(200).json(pertence)
  }

  async update(request, response) {
    const { player_id, guild_id } = request.params
    const { cargo } = request.body

    const database = await sqliteConnection()

    const checkPertenceExists = await database.get(
      'SELECT * FROM pertence WHERE playerd_id = (?) AND guild_id = (?)',
      [player_id, guild_id]
    )

    if (!checkPertenceExists) {
      throw new AppError('Pertencimento não encontrado no banco de dados')
    }

    await database.run(
      'UPDATE pertence SET cargo = (?) WHERE player_id = (?) AND guild_id = (?)',
      [cargo, player_id, guild_id]
    )

    return response.status(200).json('Cargo atualizado com sucesso.')
  }

  async softDelete(request, response) {
    const { player_id, guild_id } = request.params

    const database = await sqliteConnection()

    const checkPertenceExists = await database.get(
      'SELECT * FROM pertence WHERE player_id = (?) AND guild_id = (?)',
      [player_id, guild_id]
    )

    if (!checkPertenceExists) {
      throw new AppError('Pertencimento não encontrado no banco de dados.')
    }

    await database.run(
      'UPDATE pertence SET left_at = DATETIME("now"), cargo = 0 WHERE player_id = (?) AND guild_id = (?)',
      [player_id, guild_id]
    )

    return response
      .status(200)
      .json('Registro marcado como inativo com sucesso.')
  }
}

module.exports = PertenceController
