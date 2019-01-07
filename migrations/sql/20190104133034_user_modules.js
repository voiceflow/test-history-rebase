
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('user_modules').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('user_modules', function (t) {
          t.increments('id').primary()
          t.integer('module_id').notNullable()
          t.foreign('module_id').references('modules.module_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.integer('creator_id').notNullable()
          t.foreign('creator_id').references('creators.creator_id').onDelete('CASCADE').onUpdate('CASCADE')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};
