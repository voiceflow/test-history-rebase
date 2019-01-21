
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.hasTable('products').then(function (exists) {
      if (!exists) {
        return knex.schema.createTable('products', function (t) {
          t.increments('id').primary()
          t.integer('skill_id').references('skills.skill_id').onDelete('CASCADE').onUpdate('CASCADE')
          t.string('name')
          t.json('data')
          t.string('amzn_prod_id')
        })
      }
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
