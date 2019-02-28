
exports.up = function(knex, Promise) {
  return knex.schema.table('user_info', function (t) {
    t.boolean('design').defaultTo(false)
    t.boolean('build').defaultTo(false)
  })
};

exports.down = function(knex, Promise) {
  
};
