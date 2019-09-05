const express = require('express');
const path = require('path');

const app = express();

const server = {
  host: 'localhost',
  port: 5500,
};

const byRoot = (filepath) => {
  return path.join(__dirname, filepath);
}

app.get('/', (req, res) => {
  const byTemplates = (filepath) => path.join(byRoot('/templates'), filepath);
  res.sendFile(byTemplates('/index.html'));
});

app.get('/public/:filedir/:filepath', (req, res) => {
  const {filedir, filepath} = req.params;
  const byPublic = (filepath) => path.join(byRoot('/public'), filepath);
  res.sendFile(byPublic(path.join(filedir, filepath)));
});

app.listen(server.port, server.host, ()=> {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
