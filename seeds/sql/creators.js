
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('creators').del()
    .then(function () {
      // Inserts seed entries
      return knex('creators').insert([
        {
          "name": "Testing User",
          "email": "tests@getvoiceflow.com",
          "password": "$2b$10$cbDBMxpb3zCQImub/SuIUukx42M2jn3ybT6PCtwF3FbmnYU9RsIYG",
          "created": "2018-12-31 22:09:47.856129",
          "creator_id": 1,
          "admin": 0,
          "stripe_id": null,
          "expiry": null,
          "subscription": null,
          "gid": null,
          "fid": "NULL"
        }, {
          "name": "Template User",
          "email": "templates@getvoiceflow.com",
          "password": "$2b$10$cbDBMxpb3zCQImub/SuIUukx42M2jn3ybT6PCtwF3FbmnYU9RsIYG",
          "created": "2018-12-31 22:09:47.856129",
          "creator_id": 2125,
          "admin": 100,
          "stripe_id": null,
          "expiry": null,
          "subscription": null,
          "gid": null,
          "fid": "NULL"
        } 

      ]).then(() => {
        return knex('skills').insert([
          {
            "name": "Initial Template",
            "diagram": "b000cc30e8be511b9d5bd2b8d4aa40da",
            "creator_id": 2125,
            "intents": '[{"name":"name_intent","inputs":[{"slots":[],"text":"[name]"},{"slots":[],"text":"My name is [name]"}],"key":"tjlYMvRuRFoI","open":true}]',
            "slots": '[{"name":"name_intent","inputs":[{"slots":[],"text":"[name]"},{"slots":[],"text":"My name is [name]"}],"key":"tjlYMvRuRFoI","open":true}]'
          }
        ]).then(() => {
          return knex('diagrams').insert([
            {
              "id": "b000cc30e8be511b9d5bd2b8d4aa40da",
              "name": "ROOT",
              "skill_id": 1
            }
          ]).then(() => {
            return knex('projects').insert([
              {
                "name": "Default Project",
                "dev_version": 1,
                "creator_id": 2125
              }
            ]).then(() => {
              return knex('project_versions').insert([
                {
                  "project_id": 1,
                  "version_id": 1
                }
              ])
            }).then(() => {
              return knex('modules').insert([
                {
                  "skill_id": 1,
                  "creator_id": 2125,
                  "type": "TEMPLATES",
                  "template_index": 1,
                  "module_project_id": 1
                }
              ]).then(() => {
                return knex('versions').insert([
                  {
                    "module_id": 1,
                    "diagram_id": "b000cc30e8be511b9d5bd2b8d4aa40da",
                    "version_id": 1,
                    "template_skill_id": 1
                  }
                ]).then(() => {
                  return knex('products').insert([
                    {
                      "skill_id": 1,
                      "name": "tons of mula",
                      "data": "{}"
                    }
                  ])
                })
              })
            })
          })
        })
      });
    });
};