const http = require("http");
const fs = require("fs");
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/template-product.html`,
  "utf-8"
);
const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));
const Server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = data.map((el) => {
      replaceTemplate(tempCard, el);
    });
    res.end(tempOverview);
  } else if (pathName === "/product") {
    res.end(tempProduct);
  } else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "application/json" });
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-custom-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});
Server.listen(8000, "127.0.0.1", () => {
  console.log("Server is running on http://127.0.0.1:8000");
});
