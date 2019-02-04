
exports.up = function(knex, Promise) {
    return knex.schema.alterTable('skills', function (t) {
        t.text('dialogflow_token')
    })
};

exports.down = function(knex, Promise) {
  
};
