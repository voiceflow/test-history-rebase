
exports.up = function(knex, Promise) {
  return knex.schema.table('versions', function (t) {
    t.integer('template_skill_id').references('skills.skill_id').onDelete('CASCADE').onUpdate('CASCADE')
  });
};

exports.down = function(knex, Promise) {
  
};
