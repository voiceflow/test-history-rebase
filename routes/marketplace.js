const { pool } = require('./../services');

const getModules = (req, res) => {
	pool.query('SELECT * FROM modules ORDER BY created LIMIT 10', 
        [], (err, data) => {
        if(err){
            res.sendStatus(500);
        }else{
            res.send(data.rows);
        }
    });
}

module.exports = {
	getModules: getModules
}