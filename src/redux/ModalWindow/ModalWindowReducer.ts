import { AnyAction } from 'redux';
import { CHANGE_MODAL_WINDOW_ENABLED, CHANGE_MODAL_WINDOW_TEXT } from './Types';

const initialState = {
  isEnabled: false,
  text: '',
};

const ModalWindowReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case CHANGE_MODAL_WINDOW_ENABLED:
      return { ...state, isEnabled: action.payload };
    case CHANGE_MODAL_WINDOW_TEXT:
      return { ...state, text: action.payload };
    default:
      return state;
  }
};

export default ModalWindowReducer;
