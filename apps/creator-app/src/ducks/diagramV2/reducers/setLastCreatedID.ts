import { setLastCreatedID } from '../actions';
import { createReducer } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const setLastCreatedIDReducer = createReducer(setLastCreatedID, (state, { id }) => {
  state.lastCreatedID = id;
});

export default setLastCreatedIDReducer;
