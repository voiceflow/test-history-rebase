
exports.up = function(knex, Promise) {
  return knex.schema.table('displays', function (t) {
    t.text('datasource')
  });
};

exports.down = function(knex, Promise) {
  
};
