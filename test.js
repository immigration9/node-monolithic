const http = require('http');

const options = {
  host: "127.0.0.1",
  port: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
}

function request(cb, op, params) {
  let req = http.request(op, (res) => {
    let data = "";
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(op, data);
      if (cb) {
        cb();
      }
    });
  })

  if (params) {
    req.write(JSON.stringify(params));
  }

  req.end();
}

function goods(callback) {
  goods_post(() => {
    goods_get(() => {
      goods_delete(callback);
    })
  })

  function goods_post(cb) {
    let op = { ...options, method: "POST", path: "/goods" };
    request(cb, op, {
      name: "test goods",
      category: "tests",
      price: 1000,
      description: "test"
    });
  }

  function goods_get(cb) {
    let op = { ...options, method: "GET", path: "/goods" };
    request(cb, op);
  }

  function goods_delete(cb) {
    let op = { ...options, method: "DELETE", path: "/goods?id=2" };
    request(cb, op);
  }
}

goods();