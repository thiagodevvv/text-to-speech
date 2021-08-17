// Update with your config settings.

module.exports = {
    client: 'mysql',
    connection: {
      database: 'db_comments',
      user:     'admin',
      password: '12345'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
}
