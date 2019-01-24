
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('skills', function (t) {
        t.integer('repeat').defaultTo(100)
    })
};

exports.down = function(knex, Promise) {
  
};
