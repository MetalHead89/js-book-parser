import { put, call, takeEvery } from '@redux-saga/core/effects';

async function getBook(book) {
  // Запрос на сервер с адресом книги
}

function* getBooks(action) {
  try {
    const books = action.payload.split('\n');

    for (const book in books) {
      yield call(getBook, book.trim());
    }
  } catch (e) {
    console.log('Ошибка преобразования списка книг');
  }
}

function* WatchGetBooks() {
  yield takeEvery('GET_BOOKS', getBooks);
}

export default WatchGetBooks;
