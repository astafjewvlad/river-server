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

app.use(express.static('public'));

app.get('/', (req, res) => {
  const byTemplates = (filepath) => path.join(byRoot('/templates'), filepath);
  res.sendFile(byTemplates('/index.html'));
});

app.listen(server.port, server.host, ()=> {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
