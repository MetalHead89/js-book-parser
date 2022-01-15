import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import GetBooksSReducer from './GetBooks/GetBooksReducer';
import RootSaga from './RootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { GetBooksSReducer },
  middleware: [...getDefaultMiddleware(), sagaMiddleware],
});

sagaMiddleware.run(RootSaga);

export default store;
