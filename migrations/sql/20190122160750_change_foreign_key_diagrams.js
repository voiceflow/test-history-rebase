
exports.up = function(knex, Promise) {
  return knex.schema.table('skill_versions', function (t) {
      t.timestamp('last_save').defaultTo(knex.fn.now())
  });
};

exports.down = function(knex, Promise) {
  
};
