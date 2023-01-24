var mysql = require ('mysql');
const dotenv = require ('dotenv');
dotenv.config();

var connection = mysql.createConnection({
    port : process.env.DB_PORT,
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    user : process.env.DB_USERNAME,
    password : 'asdfghjkl@1999#'
});

module.exports = connection;