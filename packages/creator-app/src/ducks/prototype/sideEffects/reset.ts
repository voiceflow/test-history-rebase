import { batch } from 'react-redux';

import { BuiltInVariable } from '@/constants';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { activeGlobalVariablesSelector } from '@/ducks/version/selectors';
import { Store } from '@/models';
import { SyncThunk } from '@/store/types';
import { cuid } from '@/utils/string';
import * as Sentry from '@/vendors/sentry';

import { updatePrototype, updatePrototypeContext, updatePrototypeStatus } from '../actions';
import { prototypeVisualSelector } from '../selectors';
import { PrototypeStatus } from '../types';

const resetPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const visualState = prototypeVisualSelector(state);
  const globalVariables = activeGlobalVariablesSelector(state);
  const slotNames = Slot.slotNamesSelector(state);
  const platform = Project.activePlatformSelector(state);

  let variables: Store = {};
  [...globalVariables, ...slotNames].forEach((name) => {
    variables[name] = 0;
  });

  variables = {
    ...variables,
    [BuiltInVariable.USER_ID]: 'TEST_USER',
    [BuiltInVariable.PLATFORM]: platform,
    [BuiltInVariable.SESSIONS]: 1,
    [BuiltInVariable.TIMESTAMP]: 0,
    [BuiltInVariable.INTENT_CONFIDENCE]: 0,
    [BuiltInVariable.LAST_UTTERANCE]: '',
  };

  const projectID = Session.activeProjectIDSelector(state);
  const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
  if (store) {
    try {
      const savedVariables = JSON.parse(store);
      Object.keys(savedVariables).forEach((name) => {
        if (name in variables) variables[name] = savedVariables[name];
      });
    } catch (err) {
      Sentry.error(err);
    }
  }

  batch(() => {
    dispatch(updatePrototypeStatus(PrototypeStatus.IDLE));
    dispatch(updatePrototypeContext({ variables }));
    dispatch(
      updatePrototype({
        ID: cuid(),
        contextStep: 0,
        contextHistory: [],
        flowIDHistory: [],
        activePathLinkIDs: [],
        activePathBlockIDs: [],
        autoplay: false,
        visual: { ...visualState, data: null, dataHistory: [] },
      })
    );
  });
};

export default resetPrototype;
