import { activePlatformSelector, activeProjectIDSelector, globalVariablesSelector } from '@/ducks/skill';
import { slotNamesSelector } from '@/ducks/slot';
import { Store } from '@/models';
import { SyncThunk } from '@/store/types';

import { updatePrototype, updatePrototypeContext, updatePrototypeStatus } from '../actions';
import { prototypeVisualSelector } from '../selectors';
import { PrototypeMode, PrototypeStatus } from '../types';
import { log } from '../utils';

const resetPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const visualState = prototypeVisualSelector(state);
  const globalVariables = globalVariablesSelector(state);
  const slotNames = slotNamesSelector(state);
  const platform = activePlatformSelector(state);

  let variables: Store = {};
  [...globalVariables, ...slotNames].forEach((name) => {
    variables[name] = 0;
  });

  variables = {
    ...variables,
    timestamp: 0,
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
      log.error(err);
    }
  }

  dispatch(updatePrototypeStatus(PrototypeStatus.IDLE));
  dispatch(updatePrototypeContext({ variables }));
  dispatch(
    updatePrototype({
      contextStep: 0,
      contextHistory: [],
      flowIDHistory: [],
      activePathLinkIDs: [],
      activePathBlockIDs: [],
      autoplay: false,
      visual: { ...visualState, sourceID: null },
      mode: PrototypeMode.CANVAS,
    })
  );
};

export default resetPrototype;
