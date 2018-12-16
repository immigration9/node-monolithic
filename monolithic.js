/**
 * API Server Main
 */
const http = require('http');
const url = require('url');
const querystring = require('querystring');

const members = require('./monolithic_members');
const goods = require('./monolithic_goods');
const purchase = require('./monolithic_purchases');

let server = http.createServer((req, res) => {
  /**
   * method: REST GET / POST / PUT / DELETE
   * uri: 파싱된 URL 값을 갖는다. (auth / host / port / search / query / pathname 등을 포함한)
   * pathname: domain이후에 오는 path값
   */
  let method = req.method;
  let uri = url.parse(req.url, true);
  let pathname = uri.pathname;

  /**
   * Request의 Method에 따라 분기. 
   * POST / PUT의 경우, body를 parse해서 넣어주고,
   * GET / DELETE의 경우, uri query문을 넘긴다
   */
  if (method === "POST" || method === "PUT") {
    let body = "";

    req.on('data', (data) => {
      body += data;
    });

    req.on('end', () => {
      let params;
      /**
       * Request의 header값이 json일 경우, 해당 방식으로 파싱을 진행
       * 이외에는 querystring의 파싱을 사용
       */
      if (req.headers['content-type'] === "application/json") {
        params = JSON.parse(body);
      } else {
        params = querystring.parse(body);
      }
      
      onRequest(res, method, pathname, params);
    });
  } else {
    onRequest(res, method, pathname, uri.query);
  }
})

function onRequest(res, method, pathname, params) {
  switch (pathname) {
    case "/members":
      members.onRequest(res, method, pathname, params, response);
      break;
    case "/goods":
      goods.onRequest(res, method, pathname, params, response);
      break;
    case "/purchases":
      purchases.onRequest(res, method, pathname, params, response);
      break;
    default:
      res.writeHead(404);
      return res.end();
  }
  // res.end("response!");
}

function response(res, packet) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  /**
   * response.end([data][, encoding][, callback]) -> JSON형식으로 response data를 보내준다
   */
  res.end(JSON.stringify(packet));
}

server.listen(8000);