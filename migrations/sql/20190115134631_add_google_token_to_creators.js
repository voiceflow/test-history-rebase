
exports.up = function(knex, Promise) {
  return knex.schema.table('creators', function(t) {
      t.string('gactions_token')
  }).then(() => {
    return knex.schema.table('skills', function(t) {
      t.json('google_publish_info')
    })
  })
};

exports.down = function(knex, Promise) {
  // No down migrations due to risk of data loss
};