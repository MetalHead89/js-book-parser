import { all, call, spawn } from '@redux-saga/core/effects';
import WatchGetBooks from './GetBooks/GetBooksSagas';

function* startSaga(saga) {
  while (true) {
    try {
      yield call(saga);
      break;
    } catch (e) {
      console.log(e);
    }
  }
}

function* RootSaga() {
  const sagas = [WatchGetBooks];

  const retrySagas = yield sagas.map((saga) => spawn(startSaga, saga));

  yield all(retrySagas);
}

export default RootSaga;
