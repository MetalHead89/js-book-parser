import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import GetBooksSReducer from './GetBooks/GetBooksReducer';
import RootSaga from './RootSaga';
import ParserReducer from './Parser/ParserReducer';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { GetBooksSReducer, ParserReducer },
  middleware: [...getDefaultMiddleware(), sagaMiddleware],
});

sagaMiddleware.run(RootSaga);

export type RootState = ReturnType<typeof store.getState>
export default store;
