const mysql = require('mysql');
const conn = {
  host: 'localhost',
  user: 'micro',
  password: 'service',
  database: 'monolithic'
};

let connection = mysql.createConnection(conn);
module.exports = connection;
// // connection.connect();
// connection.query("query", (err, results, fields) => {
//   console.log("queried")
// });
// // connection.end();