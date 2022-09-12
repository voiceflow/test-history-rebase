import { Utils } from '@voiceflow/common';
import { batch } from 'react-redux';

import { BuiltInVariable } from '@/constants';
import { PrototypeStatus } from '@/constants/prototype';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as SlotV2 from '@/ducks/slotV2';
import * as VersionV2 from '@/ducks/versionV2';
import { Store } from '@/models';
import { SyncThunk } from '@/store/types';
import * as Sentry from '@/vendors/sentry';

import { updatePrototype, updatePrototypeContext, updatePrototypeStatus } from '../actions';
import { prototypeVisualSelector } from '../selectors';

const resetPrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const visualState = prototypeVisualSelector(state);
  const globalVariables = VersionV2.active.globalVariablesSelector(state);
  const slotNames = SlotV2.slotNamesSelector(state);
  const platform = ProjectV2.active.platformSelector(state);

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
        ID: Utils.id.cuid(),
        contextStep: 0,
        contextHistory: [],
        flowIDHistory: [],
        activePaths: {},
        autoplay: false,
        visual: { ...visualState, data: null, dataHistory: [] },
      })
    );
  });
};

export default resetPrototype;
