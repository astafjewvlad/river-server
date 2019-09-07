const express = require('express');
const path = require('path');
const fs = require('fs');

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

app.get('/tracktest', (req, res) => {
  fs.readFile(byRoot('/repos/tracks.json'), (err, data) => {
    if (err) {
      res.sendStatus(404);
      return;
    }
    const { tracks } = JSON.parse(data);
    res.render('tracktest', { tracks });
  });
});

app.listen(server.port, server.host, () => {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
