
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('versions').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('versions', function (t) {
          t.integer('module_id').notNullable()
          t.foreign('module_id').references('modules.module_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.string('diagram_id').notNullable()
          t.integer('version_id').notNullable()
          t.timestamp('cert_request', true).notNullable().defaultTo(knex.fn.now())
          t.timestamp('cert_approved')
          t.string('input').notNullable().defaultTo('[]')
          t.string('output').notNullable().defaultTo('[]')
          t.json('global').notNullable().defaultTo('[]')

          t.primary(['module_id', 'version_id'])
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};
