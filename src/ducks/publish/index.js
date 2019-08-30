import { combineReducers } from 'redux';

import alexa from './alexa';
import google from './google';

export default combineReducers({
  alexa,
  google,
});
