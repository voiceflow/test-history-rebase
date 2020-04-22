import { activePlatformSelector, activeProjectIDSelector, globalVariablesSelector } from '@/ducks/skill';
import { slotNamesSelector } from '@/ducks/slot';
import { SyncThunk } from '@/store/types';

import { updateTestingContext, updateTestingStatus } from '../actions';
import { Store, TestStatus } from '../types';

const resetState = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const globalVariables = globalVariablesSelector(state);
  const slotNames = slotNamesSelector(state);
  const platform = activePlatformSelector(state);

  let variables: Store = {};
  [...globalVariables, ...slotNames].forEach((name) => {
    variables[name] = 0;
  });

  variables = {
    ...variables,
    sessions: 1,
    user_id: 'TEST_USER',
    platform,
  };

  const projectID = activeProjectIDSelector(state);
  const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
  if (store) {
    try {
      const savedVariables = JSON.parse(store);
      Object.keys(savedVariables).forEach((name) => {
        if (name in variables) variables[name] = savedVariables[name];
      });
    } catch (err) {
      console.error(err);
    }
  }

  dispatch(updateTestingStatus(TestStatus.IDLE));
  dispatch(updateTestingContext({ variables }));
};

export default resetState;
