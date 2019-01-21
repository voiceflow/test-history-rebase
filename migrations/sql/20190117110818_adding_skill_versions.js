
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('skill_versions').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('skill_versions', function (t) {
          t.integer('canonical_skill_id')
          t.integer('skill_id').notNullable().references('skills.skill_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.integer('version')

          t.primary(['skill_id', 'canonical_skill_id'])
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
  // No down migrations due to risk of data loss
};
