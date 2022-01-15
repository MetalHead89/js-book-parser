import { AnyAction } from 'redux';

const initialState = {};

const GetBooksSReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default GetBooksSReducer;
