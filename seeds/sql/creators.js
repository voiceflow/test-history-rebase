
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
        }
      ]);
    });
};