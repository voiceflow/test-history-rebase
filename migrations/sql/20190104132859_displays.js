
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('displays').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('displays', function (t) {
          t.increments('id').primary()
          t.text('document').notNullable().defaultTo('')
          t.timestamp('created_at', true).notNullable().defaultTo(knex.fn.now())
          t.timestamp('modified', true).notNullable().defaultTo(knex.fn.now())
          t.json('compatibility')
          t.integer('creator_id').notNullable()
          t.foreign('creator_id').references('creators.creator_id').onDelete('CASCADE')
          t.string('title').notNullable()
          t.string('description')
          t.integer('skill_id')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};