
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('featured').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('featured', function (t) {
          t.increments('id').primary()
          t.integer('module_id')
          t.foreign('module_id').references('modules.module_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.string('banner_img')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};

