
exports.up = function(knex, Promise) {
  return knex.schema.table('skill_versions', function (t) {
      t.text('last_save')
  });
};

exports.down = function(knex, Promise) {
  
};
