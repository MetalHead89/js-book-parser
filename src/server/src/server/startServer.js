import express from 'express';
import config from './config.js';
import parse from './routes/parse.js';
import cors from 'cors';

const PORT = config.port;
const server = express();

server.use(express.json())
server.use(cors({ origin: 'http://localhost:3000' }));
server.use('/book', parse);

// server.post('/book/parse', async (req, res) => {
//   console.log('sdfsdf')
//   // try {
//   //   const { uri } = req.body;

//   //   res.status(201).json({message: 'Парсинг книги завершен успешно'})
//   // } catch {
//   //   res.status(500).json({
//   //     message: 'Что-то пошло не так и сервер не смог обработать данный запрос',
//   //   });
//   // }
// });

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
