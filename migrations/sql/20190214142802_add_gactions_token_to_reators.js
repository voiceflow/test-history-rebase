
exports.up = function(knex, Promise) {
  return knex.schema.table('creators', function (t) {
    t.text('gactions_token')
})
};

exports.down = function(knex, Promise) {
  
};
