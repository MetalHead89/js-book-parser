import express from 'express';
import config from './config.js';

const PORT = config.port;
const server = express();

const startServer = () => {
  server.get('/start-parsing', (req, res) => {
    console.log('parsing started');
  });

  server.listen(PORT, () => {
    console.log(`Express server has been started on http://localhost:${PORT}`);
  });
};

export default startServer;
