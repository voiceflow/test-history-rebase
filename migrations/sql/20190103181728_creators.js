
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('creators').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('creators', function (t) {
          t.increments('creator_id').primary()
          t.string('name')
          t.string('email')
          t.string('password')
          t.timestamp('created', true).defaultTo(knex.fn.now())
          t.integer('admin').unsigned().defaultTo(0)
          t.string('stripe_id')
          t.integer('expiry')
          t.string('subscription')
          t.string('gid')
          t.string('fid').defaultTo('NULL')
        })
      }
    })
  ])
};

exports.down = function (knex, Promise) {
  // Legacy table, no actions taken on down migration
  return Promise.resolve()
};
