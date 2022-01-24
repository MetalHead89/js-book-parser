import { put, call, takeEvery } from '@redux-saga/core/effects';
import axios from 'axios';
import { AnyAction } from 'redux';
import { CHANGE_BUTTON_DISABLED_STATE, SAVE_BOOKS } from './Types';
import config from '../../server/src/server/config.js';
import { CHANGE_MODAL_WINDOW_ENABLED } from '../ModalWindow/Types';

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

function* getBooks(action: AnyAction) {
  try {
    yield put({ type: CHANGE_BUTTON_DISABLED_STATE, payload: true });
    yield put({ type: CHANGE_MODAL_WINDOW_ENABLED, payload: true});
    const books = action.payload.split('\n');

    for (const book of books) {
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
  yield takeEvery(SAVE_BOOKS, getBooks);
}

export default WatchSaveBooks;
