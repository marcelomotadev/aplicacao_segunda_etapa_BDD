const AppError = require('../Utils/AppError')
const sqliteConnection = require('../database/sqlite')

class PertenceController {
  async create(request, response) {
    const { player_id, guild_id, cargo } = request.body

    const database = await sqliteConnection()

    const checkPertenceExists = await database.get(
      'SELECT * FROM pertence WHERE player_id = (?) AND guild_id = (?)',
      [player_id, guild_id]
    )

    if (checkPertenceExists) {
      throw new AppError('Esse player já pertence a esta guild')
    }

    await database.run(
      'INSERT INTO pertence (player_id, guild_id, cargo) VALUES (?, ?, ?)',
      [player_id, guild_id, cargo]
    )

    return response
      .status(201)
      .json(`Player: ${player_id} agora pertence a guild: ${guild_id}.`)
  }

  async show(request, response) {
    const database = await sqliteConnection();
  
    // Consulta para obter todas as guilds com os players associados
    const guildsWithPlayers = await database.all(
      'SELECT g.guild_id, g.name AS guild_name, p.player_id, p.name AS player_name ' +
      'FROM guild g ' +
      'INNER JOIN pertence pert ON g.guild_id = pert.guild_id ' +
      'INNER JOIN player p ON pert.player_id = p.player_id ' +
      'WHERE pert.cargo != 0'
    );
  
    if (guildsWithPlayers.length === 0) {
      throw new AppError('Nenhum jogador encontrado para nenhuma guild.');
    }
  
    // Organizar os resultados em uma estrutura de dados
    const guildsInfo = {};
  
    guildsWithPlayers.forEach((row) => {
      const { guild_id, guild_name, player_id, player_name } = row;
  
      if (!guildsInfo[guild_id]) {
        guildsInfo[guild_id] = {
          guild_id,
          guild_name,
          players: [],
        };
      }
  
      guildsInfo[guild_id].players.push({
        player_id,
        player_name,
      });
    });
  
    return response.status(200).json(Object.values(guildsInfo));
  }
  

  async update(request, response) {
    const { player_id, guild_id } = request.params
    const { cargo } = request.body

    const database = await sqliteConnection()

    const checkPertenceExists = await database.get(
      'SELECT * FROM pertence WHERE player_id = (?) AND guild_id = (?)',
      [player_id, guild_id]
    )

    if (!checkPertenceExists) {
      throw new AppError('Pertencimento não encontrado no banco de dados')
    }

    await database.run(
      'UPDATE pertence SET cargo = (?), left_at = NULL WHERE player_id = (?) AND guild_id = (?)',
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
