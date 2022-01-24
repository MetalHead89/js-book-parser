import { AnyAction } from 'redux';
import { CHANGE_MODAL_WINDOW_ENABLED } from './Types';

const initialState = {
  isEnabled: false
};

const
  ModalWindowReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
      case CHANGE_MODAL_WINDOW_ENABLED:
        return { ...state, isEnabled: action.payload }
      default:
        return state;
    }
  };

export default ModalWindowReducer;
