const createGuild = `
  CREATE TABLE IF NOT EXISTS guild (
    guild_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    FOREIGN KEY (guild_id) REFERENCES dono(id)
  )
`

module.exports = createGuild;
