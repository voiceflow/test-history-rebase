
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('email_templates').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('email_templates', function (t) {
          t.integer('creator_id').notNullable().primary()
          t.foreign('creator_id').references('creators.creator_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.string('usage_type').notNullable()
          t.string('company_name')
          t.string('role')
          t.string('company_size')
          t.string('industry')
          t.string('org')
          t.integer('xp')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};
