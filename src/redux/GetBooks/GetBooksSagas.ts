import { put, call, takeEvery } from '@redux-saga/core/effects';
import axios from 'axios';
import { AnyAction } from 'redux';
import { GET_BOOKS } from './Types';
import config from '../../server/src/server/config.js';

const SERVER_PORT = config.port;

async function getBook(book: string) {
  const response = await axios({
    url: `http://localhost:${SERVER_PORT}/book/parse`,
    method: 'post',
    data: {
      url: book,
    },
  });
}

function* getBooks(action: AnyAction) {
  console.log(action);
  
  try {
    const books = action.payload.split('\n');

    for (const book in books) {
      yield call(getBook, book.trim());
    }
  } catch (e) {
    console.log(e);
  }
}

function* WatchGetBooks() {
  yield takeEvery(GET_BOOKS, getBooks);
}

export default WatchGetBooks;
