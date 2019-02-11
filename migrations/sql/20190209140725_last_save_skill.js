
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('skills', function (t) {
      t.timestamp('last_save', false).notNullable().defaultTo(knex.raw('NOW()'))
  })
};

exports.down = function(knex, Promise) {
  
};
