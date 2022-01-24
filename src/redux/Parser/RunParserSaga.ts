import { put, call, takeEvery } from '@redux-saga/core/effects';
import config from '../../server/src/server/config'
import axios from 'axios';
import { AnyAction } from 'redux';
import { CHANGE_PARSER_READINESS_STATE, CHANGE_PARSER_STARTUP_STATE, START_PARSER } from './Types';

const SERVER_PORT = config.port;

async function run() {
  return await axios({
    url: `http://localhost:${SERVER_PORT}/parser/run`,
    method: 'post'
  });
}

function* runParser(action: AnyAction) {
  try {
    yield put({ type: CHANGE_PARSER_STARTUP_STATE, payload: true });
    const response: Response = yield call(run);

    if (response.status === 201) {
      yield put({ type: CHANGE_PARSER_READINESS_STATE, payload: true });
    }
    yield put({ type: CHANGE_PARSER_STARTUP_STATE, payload: false });
    
  } catch (e) {
    console.log(e);
  }
}

function* WatchRunParser() {
  yield takeEvery(START_PARSER, runParser);
}

export default WatchRunParser;
