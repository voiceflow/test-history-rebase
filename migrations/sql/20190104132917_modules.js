
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('modules').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('modules', function (t) {
          t.increments('module_id').primary()
          t.string('title', 30)
          t.string('descr', 300)
          t.timestamp('created', true).defaultTo(knex.fn.now())
          t.integer('creator_id')
          t.foreign('creator_id').references('creators.creator_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.integer('display_version')
          t.integer('skill_id')
          t.foreign('skill_id').references('skills.skill_id').onDelete('SET NULL').onUpdate('SET NULL')
          t.string('tags').defaultTo('[]')
          t.string('type', 50)
          t.text('overview')
          t.string('module_icon', 300)
          t.string('color', 10).notNullable().defaultTo('6CD132')
          t.string('input').notNullable().defaultTo('[]')
          t.string('output').notNullable().defaultTo('[]')
          t.json('global').notNullable().defaultTo('[]')

        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};
