
exports.up = function(knex, Promise) {
  return knex.schema.table('skills', function(t) {
    t.json('google_publish_info').defaultTo('{}')
    t.string('platform').defaultTo('alexa').notNullable()
  })
};

exports.down = function(knex, Promise) {
  // No down migrations due to risk of data loss
};