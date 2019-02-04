
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('skill_versions', function (t) {
        t.string('published_platform').defaultTo('alexa')
    })
};

exports.down = function(knex, Promise) {
  
};
