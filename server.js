const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Ensures that anyone who navigates to the website will use a secure URL.
const enforceHttps = (req, res, next) => {
  if (!req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production") {
    res.redirect(301, `https://${req.get("host")}${req.url}`);
  } else {
    next();
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(enforceHttps);
app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3002;
server.listen(port);

console.log(`Server listening on ${port}`);
