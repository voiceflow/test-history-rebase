
exports.up = function(knex, Promise) {
  return knex.schema.table('creators', function(t) {
      t.string('gactions_token', 500)
  }).then(() => {
    return knex.schema.table('skills', function(t) {
      t.json('google_publish_info').defaultTo('{}')
      t.boolean('is_google_view_active').defaultTo(false)
    })
  })
};

exports.down = function(knex, Promise) {
  // No down migrations due to risk of data loss
};