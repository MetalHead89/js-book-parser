import { Router } from 'express';

const parse = Router();

parse.post('/parse', async (req, res) => {
  try {
    const { uri } = req.body;

    res.status(201).json({message: 'Парсинг книги завершен успешно'})
  } catch {
    res.status(500).json({
      message: 'Что-то пошло не так и сервер не смог обработать данный запрос',
    });
  }
});

export default parse;
