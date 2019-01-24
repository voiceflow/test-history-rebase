
exports.up = function(knex, Promise) {
  return knex.schema.table('skills', function (t) {
    t.json('alexa_events')
    t.json('alexa_interfaces')
    t.json('alexa_permissions')
  });
};

exports.down = function(knex, Promise) {
  
};
