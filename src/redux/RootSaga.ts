import { all, call, spawn, CallEffect } from '@redux-saga/core/effects';
import { Saga } from '@redux-saga/types';
import WatchRunParser from './Parser/RunParserSaga';
import WatchSaveBooks from './Parser/SaveBooksSaga';

function* startSaga(
  saga: Saga<any>
): Generator<CallEffect<unknown>, void, unknown> {
  while (true) {
    try {
      yield call(saga);
      break;
    } catch (e) {
      console.log(e);
    }
  }
}

function* RootSaga(): Generator<any, any, any> {
  const sagas = [WatchRunParser, WatchSaveBooks];

  const retrySagas = yield sagas.map((saga) => spawn(startSaga, saga));

  yield all(retrySagas);
}

export default RootSaga;
