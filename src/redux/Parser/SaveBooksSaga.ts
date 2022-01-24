import { put, call, takeEvery } from '@redux-saga/core/effects';
import axios from 'axios';
import { AnyAction } from 'redux';
import { CHANGE_BUTTON_DISABLED_STATE, SAVE_BOOKS, START_PARSER } from './Types';
import config from '../../server/src/server/config.js';
import { CHANGE_MODAL_WINDOW_ENABLED, CHANGE_MODAL_WINDOW_TEXT } from '../ModalWindow/Types';

const SERVER_PORT = config.port;

async function saveBook(url: string) {
  const response = await axios({
    url: `http://localhost:${SERVER_PORT}/parser/save-book`,
    method: 'post',
    data: {
      url: url,
    },
  });
}

async function run() {
  return await axios({
    url: `http://localhost:${SERVER_PORT}/parser/run`,
    method: 'post',
  });
}

function* saveBooks(action: AnyAction) {
  try {
    yield put({ type: CHANGE_BUTTON_DISABLED_STATE, payload: true });

    yield put({
      type: CHANGE_MODAL_WINDOW_TEXT,
      payload: 'Идет подготовка ПО...',
    });
    yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: true });

    const response: Response = yield call(run);
    
    // yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: true});
    
    const books = action.payload.split('\n');
    for (const [index, book] of books.entries()) {
      console.log(index);
      yield put({
        type: CHANGE_MODAL_WINDOW_TEXT,
        payload: `Идет сохранение книги № ${index + 1}`,
      });
      // yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: true });
      yield call(saveBook, book.trim());
    }
    yield put({ type: CHANGE_BUTTON_DISABLED_STATE, payload: false });
    yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: false});
  } catch (e) {
    yield put({ type: CHANGE_BUTTON_DISABLED_STATE, payload: false });
    yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: false});
    console.log(e);
  }
}

function* WatchSaveBooks() {
  yield takeEvery(SAVE_BOOKS, saveBooks);
}

export default WatchSaveBooks;
