/**
 * Purchase management
 */
const connection = require('./db_connection');

module.exports.onRequest = (res, method, pathname, params, cb) => {
  switch (method) {
    case "POST":
      return register(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    case "GET":
      return inquiry(method, pathname, params, (response) => {
        process.nextTick(cb, res, response);
      });
    default:
      return process.nextTick(cb, res, null);
  }
}

function register(method, pathname, params, cb) {
  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  if (params.userid == null || params.goodsid == null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    // connection.connect();
    connection.query(
      "insert into purchases(userid, goodsid) values (?, ? )",
      [params.userid, params.goodsid],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        }
        cb(response);
      }
    );
    // connection.end();
  }
}

function inquiry(method, pathname, params, cb) {
  let response = {
    key: params.key,
    errorcode: 0,
    errormessage: "success"
  };

  if (params.userid == null) {
    response.errorcode = 1;
    response.errormessage = "Invalid Parameters";
    cb(response);
  } else {
    // connection.connect();
    connection.query(
      "select id, goodsid, date from purchases where userid = ?",
      [params.userid],
      (error, results, fields) => {
        if (error) {
          response.errorcode = 1;
          response.errormessage = error;
        } else {
          response.results = results;
        }
        cb(response);
      }
    );
    // connection.end();
  }
}