const AppError = require('../Utils/AppError');
const sqliteConnection = require('../database/sqlite');

class PlayersController {

  async create(request, response) {
    const { name } = request.body;

    const database = await sqliteConnection();

    const checkPlayerExists = await database.get(
      'SELECT * FROM player WHERE name = (?)',
      [name]
    );

    if (checkPlayerExists) {
      throw new AppError('Este nome de player já está em uso.');
    }

    // Criar um registro na tabela `dono` ao criar um player
    await database.run(
      'INSERT INTO dono (tipo) VALUES (?)',
      [1] // Defina o valor do tipo de dono conforme necessário
    );

    // Recupere o ID do dono recém-criado
    const { lastID } = await database.get('SELECT last_insert_rowid() AS lastID');

    // Crie o player vinculando-o ao dono
    await database.run(
      'INSERT INTO player ( name, player_id) VALUES (?, ?)',
      [ name, lastID]
    );

    return response.status(201).json('Player adicionado com sucesso.');
  }

  async update(request, response) {
    const { player_id } = request.params;
    const { name } = request.body;

    const database = await sqliteConnection();

    // Verifique se o jogador existe
    const checkPlayerExists = await database.get(
      'SELECT * FROM player WHERE player_id = (?)',
      [player_id]
    );

    if (!checkPlayerExists) {
      throw new AppError('Jogador não encontrado no banco de dados.');
    }

    // Atualize o nome do jogador
    await database.run(
      'UPDATE player SET name = (?) WHERE player_id = (?)',
      [name, player_id]
    );

    return response.status(200).json('Nome do jogador atualizado com sucesso.');
  }

  async leaveGuild(request, response) {
    const { player_id } = request.params;

    const database = await sqliteConnection();

    // Verifique se o jogador existe
    const checkPlayerExists = await database.get(
      'SELECT * FROM player WHERE player_id = (?)',
      [player_id]
    );

    if (!checkPlayerExists) {
      throw new AppError('Jogador não encontrado no banco de dados.');
    }

    // Atualize o player_guild_id para null para sair da guild
    await database.run(
      'UPDATE player SET player_guild_id = null WHERE player_id = (?)',
      [player_id]
    );

    await database.run(
      'UPDATE pertence SET left_at = DATETIME("now"), cargo = 0 WHERE player_id = (?) and cargo != 0',
      [player_id]
    );

    return response.status(200).json('Jogador saiu da guild com sucesso.');
  }

  async enterGuild(request, response) {
    const { player_id } = request.params;
    const { guildId } = request.body;

    const database = await sqliteConnection();

    // Verifique se o jogador existe
    const checkPlayerExists = await database.get(
      'SELECT * FROM player WHERE player_id = (?)',
      [player_id]
    );

    if (!checkPlayerExists) {
      throw new AppError('Jogador não encontrado no banco de dados.');
    }

    // Atualize o campo player_guild_id para associar o jogador à guild
    await database.run(
      'UPDATE player SET player_guild_id = (?) WHERE player_id = (?)',
      [guildId, player_id]
    );

    // Crie uma nova linha na tabela "pertence" para registrar a associação
    await database.run(
      'INSERT INTO pertence (player_id, guild_id) VALUES (?, ?)',
      [player_id, guildId] // Você pode definir o valor padrão ou especificar o cargo desejado
    );

    return response.status(201).json('Jogador associado à guild com sucesso.');
  }

  async show(request, response) {
    const { player_id } = request.params

    const database = await sqliteConnection()

    // Consulta para obter informações do jogador
    const playerInfo = await database.get(
      'SELECT p.player_id, p.name, p.player_guild_id, g.name AS guild_name ' +
        'FROM player p ' +
        'LEFT JOIN guild g ON p.player_guild_id = g.guild_id ' +
        'WHERE p.player_id = (?)',
      [player_id]
    )

    if (!playerInfo) {
      throw new AppError('Jogador não encontrado no banco de dados.')
    }

    // Consulta para obter informações da tabela "pertence" (cargo e joined_at)
    const pertenceInfo = await database.all(
      'SELECT cargo, joined_at ' + 'FROM pertence ' + 'WHERE player_id = (?)',
      [player_id]
    )

    // Combine as informações do jogador e da tabela "pertence"
    const result = {
      player_id: playerInfo.player_id,
      name: playerInfo.name,
      player_guild_id: playerInfo.player_guild_id,
      guild_name: playerInfo.guild_name,
      pertence: pertenceInfo
    }

    return response.status(200).json(result)
  }

}

module.exports = PlayersController;
