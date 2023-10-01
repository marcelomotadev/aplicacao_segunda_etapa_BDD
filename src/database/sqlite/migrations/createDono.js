const createDono = `
  CREATE TABLE IF NOT EXISTS dono (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo INTEGER NOT NULL
  )
`

module.exports = createDono;
