
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('skill_versions', function (t) {
        t.json('google_versions')
    })
};

exports.down = function(knex, Promise) {
  
};
