const sqliteConnection = require('../../sqlite')
const createPlayer = require('./createPlayer')
const createGuild = require('./createGuild')
const createDono = require('./createDono')
const createPertence = require('./createPertence')

async function migrationsRun() {
  try {
    const db = await sqliteConnection()

    // Execute as consultas uma por uma
    await db.exec(createDono)
    await db.exec(createPlayer)
    await db.exec(createGuild)
    await db.exec(createPertence)

    console.log('Migrações executadas com sucesso.')
  } catch (error) {
    console.error('Erro ao executar migrações:', error)
  }
}

module.exports = migrationsRun
