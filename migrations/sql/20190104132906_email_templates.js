
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('email_templates').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('email_templates', function (t) {
          t.increments('template_id').primary()
          t.integer('creator_id')
          t.timestamp('created', true).defaultTo(knex.fn.now())
          t.timestamp('modified', true).defaultTo(knex.fn.now())
          t.string('title').defaultTo('')
          t.text('content').defaultTo('')
          t.string('sender').defaultTo('mail@getvoiceflow.com')
          t.text('variables').defaultTo('[]')
          t.text('subject').defaultTo('')
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
