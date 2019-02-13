
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('diagrams').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('diagrams', function (t) {
          t.string('id').primary()
          t.string('name')
          t.timestamp('created', true).defaultTo(knex.fn.now())
          t.timestamp('modified', true).defaultTo(knex.fn.now())
          t.integer('skill_id')
          t.foreign('skill_id').references('skills.skill_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.text('sub_diagrams').defaultTo('[]')
          t.json('permissions').defaultTo('[]')
          t.json('used_intents').notNullable().defaultTo('[]')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};