
exports.up = function(knex, Promise) {
  return knex.schema.table('creators', function(t) {
      t.string('google_refresh_token')
  });
};

exports.down = function(knex, Promise) {
  // No down migrations due to risk of data loss
};