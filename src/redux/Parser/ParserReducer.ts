import { AnyAction } from 'redux';
import { CHANGE_PARSER_READINESS_STATE, CHANGE_PARSER_STARTUP_STATE } from './Types';

const initialState = {
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
      default:
        return state;
    }
  };

export default ParserReducer;
