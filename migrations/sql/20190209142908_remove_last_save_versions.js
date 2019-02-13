
exports.up = function(knex, Promise) {
  knex.schema.table('skill_versions', function(t) {
      t.dropColumn('last_save')
  })
  knex.schema.table('skills', function(t) {
    t.dropColumn('last_save')
  })
  return
};

exports.down = function(knex, Promise) {
  
};
