exports.up = function(knex) {
    return knex.schema.createTable('comments', table => {
        table.increments('id').primary()
        table.string('comment', 300).notNull()
        table.string('id_voice',100).notNull()
    })
  };
  
  exports.down = function(knex) {
      return knex.schema.dropTable('comments')
    
  };