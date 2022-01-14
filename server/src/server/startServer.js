import express from 'express';
import config from './config.js';
import parse from './routes/parse.js';

const PORT = config.port || 5000;
const server = express();

server.use('/book', parse)

// server.get('/start-parsing', (req, res) => {
//   console.log('parsing started');
// });

const startServer = () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server has been started on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1); // Выход из процесса nodejs
  }
};

export default startServer;
