
exports.up = function(knex, Promise) {
  return knex.schema.table('skills', function(t) {
      t.json('fulfillment').defaultTo('{}');
  });
};

exports.down = function(knex, Promise) {
  // No down migrations due to risk of data loss
};