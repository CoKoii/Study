const fs = require("fs");
const http = require("http");
const url = require("url");
const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/overview") {
    res.end("hello from the server");
  } else if (pathName === "/product") {
    res.end("hello from the product");
  } else {
    res.end("page not found");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on port 8000");
});
