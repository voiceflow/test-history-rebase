
exports.up = function (knex, Promise) {
  return knex.schema.table('modules', function (t) {
    t.integer('template_index').defaultTo(0)
  });
};

exports.down = function (knex, Promise) {

};
