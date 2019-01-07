
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('sessions').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('sessions', function (t) {
          t.string('user_id')
          t.integer('skill_id')
          t.foreign('skill_id').references('skills.skill_id').onDelete('CASCADE')
          t.timestamp('time', true)
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};
