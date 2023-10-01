const AppError = require('../Utils/AppError');
const sqliteConnection = require('../database/sqlite')

class UsersController {

  async create(request, response) {
    const { cpf, name, data_nascimento } = request.body;

    const database = await sqliteConnection();

    const checkUsersExists = await database.get(
      'SELECT * FROM users WHERE cpf = (?)',
      [cpf]
      );

    if (checkUsersExists) {
      throw new AppError('Este cpf já está em uso.')
    }

    await database.run(
      'INSERT INTO users (cpf, name, data_nascimento) VALUES (?, ?, ?)',
      [cpf, name, data_nascimento]
    )
      
    return response.status(201).json('Usuário adicionado com sucesso.');
  }

  async show(request, response) {
  
    const { cpf } = request.params;

    const database = await sqliteConnection();

    const checkUsersExists = await database.get(
      'SELECT * FROM users WHERE cpf = (?)',
      [cpf]
      );

    if (!checkUsersExists) { 
      throw new AppError('CPF não encontrado no banco de dados.')
    }

    return response.status(201).json(checkUsersExists);
  
  }



}

module.exports = UsersController