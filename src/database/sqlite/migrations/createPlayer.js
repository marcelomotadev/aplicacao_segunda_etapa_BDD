const createPlayer = `
  CREATE TABLE IF NOT EXISTS player (
    player_id INTEGER PRIMARY KEY,
    player_guild_id INTEGER,
    name VARCHAR NOT NULL,
    FOREIGN KEY (player_id) REFERENCES dono(id),
    FOREIGN KEY (player_guild_id) REFERENCES guild(guild_id)
  )
`

module.exports = createPlayer;
