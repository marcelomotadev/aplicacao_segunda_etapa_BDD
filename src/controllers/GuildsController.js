const AppError = require('../Utils/AppError')
const sqliteConnection = require('../database/sqlite')

class GuildsController {
  async create(request, response) {
    const { name } = request.body

    const database = await sqliteConnection()

    const checkGuildExists = await database.get(
      'SELECT * FROM guild WHERE name = (?)',
      [name]
    )

    if (checkGuildExists) {
      throw new AppError('Este nome de guild já está em uso.')
    }

    // Criar um registro na tabela `dono` com tipo 2 (conforme mencionado)
    await database.run(
      'INSERT INTO dono (tipo) VALUES (?)',
      [2] // Tipo de dono para guild (2)
    )

    // Recupere o ID do dono recém-criado
    const { lastID } = await database.get(
      'SELECT last_insert_rowid() AS lastID'
    )

    // Crie a guild vinculando-a ao dono
    await database.run('INSERT INTO guild (name, guild_id) VALUES (?, ?)', [
      name,
      lastID
    ])

    return response.status(201).json('Guild adicionada com sucesso.')
  }

  async update(request, response) {
    const { guild_id } = request.params
    const { name } = request.body

    const database = await sqliteConnection()

    // Verifique se a guild existe
    const checkGuildExists = await database.get(
      'SELECT * FROM guild WHERE guild_id = (?)',
      [guild_id]
    )

    if (!checkGuildExists) {
      throw new AppError('Guild não encontrada no banco de dados.')
    }

    // Atualize o nome da guild
    await database.run('UPDATE guild SET name = (?) WHERE guild_id = (?)', [
      name,
      guild_id
    ])

    return response.status(200).json('Nome da guild atualizado com sucesso.')
  }

  async show(request, response) {
    const { guild_id } = request.params

    const database = await sqliteConnection()

    // Consulta para obter informações da guild
    const guildInfo = await database.get(
      'SELECT g.guild_id, g.name ' + 'FROM guild g ' + 'WHERE g.guild_id = (?)',
      [guild_id]
    )

    if (!guildInfo) {
      throw new AppError('Guild não encontrada no banco de dados.')
    }

    // Consulta para obter a lista de jogadores com cargo diferente de 0 na tabela "pertence"
    const playersInfo = await database.all(
      'SELECT p.name AS player_name, pertence.cargo ' +
        'FROM player p ' +
        'INNER JOIN pertence ON p.player_id = pertence.player_id ' +
        'WHERE pertence.guild_id = (?) AND pertence.cargo != 0',
      [guild_id]
    )

    // Combine as informações da guild e dos jogadores
    const result = {
      guild_id: guildInfo.guild_id,
      name: guildInfo.name,
      players: playersInfo
    }

    return response.status(200).json(result)
  }
}

module.exports = GuildsController
