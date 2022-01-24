import { AnyAction } from 'redux';
import { CHANGE_BUTTON_DISABLED_STATE, CHANGE_PARSER_READINESS_STATE, CHANGE_PARSER_STARTUP_STATE } from './Types';

const initialState = {
  isButtonDisabled: false,
  isParserStarts: false,
  isParserReady: false
};

const
  ParserReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
      case CHANGE_PARSER_STARTUP_STATE:
        return { ...state, isParserStarts: action.payload }
      case CHANGE_PARSER_READINESS_STATE:
        return { ...state, isParserReady: action.payload }
      case CHANGE_BUTTON_DISABLED_STATE:
        return { ...state, isButtonDisabled: action.payload }
      default:
        return state;
    }
  };

export default ParserReducer;
