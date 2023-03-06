/* eslint-disable no-param-reassign */
import { setLastCreatedID } from '../actions';
import { createReducer } from './utils';

const setLastCreatedIDReducer = createReducer(setLastCreatedID, (state, { id }) => {
  state.lastCreatedID = id;
});

export default setLastCreatedIDReducer;
