import express from 'express';

const server = express();
const port = 5000;

const startServer = () => {
  server.get('/start-parsing', (req, res) => {
    console.log('parsing started');
  });

  server.listen(port, () => {
    console.log(`Express server has been started on http://localhost:${port}`);
  });
};

export default startServer;
