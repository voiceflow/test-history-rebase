
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('skills').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('skills', function (t) {
          t.increments('skill_id').primary()
          t.string('name', null).notNullable().defaultTo('')
          t.string('diagram').notNullable()
          t.integer('creator_id')
          t.foreign('creator_id').references('creators.creator_id').onDelete('CASCADE')
          t.timestamp('created', true).defaultTo(knex.fn.now())
          t.string('amzn_id')
          t.text('summary').defaultTo('')
          t.text('description').defaultTo('')
          t.text('keywords').defaultTo('')
          t.json('invocations').defaultTo('{"value":[""]}')
          t.string('small_icon')
          t.string('large_icon')
          t.string('category')
          t.boolean('purchase').defaultTo(false)
          t.boolean('personal').defaultTo(false)
          t.boolean('copa').defaultTo(false)
          t.boolean('ads').defaultTo(false)
          t.boolean('export').defaultTo(true)
          t.text('instructions').defaultTo('Sample Instruction')
          t.string('inv_name').defaultTo('')
          t.integer('stage').unsigned().defaultTo(0)
          t.boolean('review').notNullable().defaultTo(false)
          t.boolean('live').notNullable().defaultTo(false)
          t.json('locales').notNullable().defaultTo('["en-US"]')
          t.boolean('restart').notNullable().defaultTo(true)
          t.json('global').notNullable().defaultTo('[]')
          t.string('privacy_policy').defaultTo('')
          t.string('terms_and_cond').defaultTo('')
          t.json('intents').notNullable().defaultTo('[]')
          t.json('slots').notNullable().defaultTo('[]')
          t.json('used_intents').notNullable().defaultTo('[]')
          t.json('used_choices').notNullable().defaultTo('[]')
          t.boolean('preview').notNullable().defaultTo(false)
          t.json('resume_prompt')
          t.json('error_prompt')
          t.json('account_linking')
          t.json('access_token_variable')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
    // Legacy table, no actions taken on down migration
    return Promise.resolve()
};