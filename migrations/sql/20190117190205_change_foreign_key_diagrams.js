
exports.up = function(knex, Promise) {
  return knex.schema.table('diagrams', function (t) {
    t.foreign('skill_id').references('skills.skill_id').onDelete('CASCADE').onUpdate('CASCADE')
  });
};

exports.down = function(knex, Promise) {
  
};
