const express = require('express');
const path = require('path');

const app = express();

const server = {
  host: 'localhost',
  port: 5500,
};

const byRoot = (filepath) => path.join(__dirname, filepath);

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './templates');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(server.port, server.host, () => {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
