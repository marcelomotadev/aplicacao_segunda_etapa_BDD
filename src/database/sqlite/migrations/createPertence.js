const createPertence = `
  CREATE TABLE IF NOT EXISTS pertence (
    player_id INTEGER,
    guild_id INTEGER,
    cargo VARCHAR,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(player_id, guild_id)
  )
`

module.exports = createPertence
