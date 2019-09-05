const express = require('express');

const app = express();

const server = {
  host: 'localhost',
  port: 5500,
};

app.get('/', (req, res) => {
  res.send('<h1>hello!</h1>');
});

app.listen(server.port, server.host, ()=> {
  console.log(`Server started! Listening ${server.host}:${server.port}`);
});
