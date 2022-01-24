import { all, call, spawn, CallEffect } from '@redux-saga/core/effects';
import { Saga } from '@redux-saga/types';
import WatchGetBooks from './GetBooks/GetBooksSagas';
import WatchRunParser from './Parser/RunParserSaga';

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
  const sagas = [WatchRunParser, WatchGetBooks];

  const retrySagas = yield sagas.map((saga) => spawn(startSaga, saga));

  yield all(retrySagas);
}

export default RootSaga;
