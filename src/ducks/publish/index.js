import { combineReducers } from 'redux';

import alexa, * as Alexa from './alexa';
import google, * as Google from './google';

export default combineReducers({
  [Alexa.PLATFORM]: alexa,
  [Google.PLATFORM]: google,
});
