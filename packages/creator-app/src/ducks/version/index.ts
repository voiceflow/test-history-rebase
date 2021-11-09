import { Utils } from '@voiceflow/common';

import createCRUDReducer from '@/ducks/utils/crud';
import { Reducer, RootReducer } from '@/store/types';

import { AnyVersionAction, UpdatePublishing, UpdateSession, UpdateSettings, VersionAction } from './actions';
import { INITIAL_STATE, STATE_KEY } from './constants';
import * as alexa from './platform/alexa';
import * as dialogflow from './platform/dialogflow';
import * as general from './platform/general';
import * as google from './platform/google';
import { AnyVersion, AnyVersionPublishing, AnyVersionSettings, VersionState } from './types';

export { alexa, dialogflow, general, google };

export * from './actions';
export * from './constants';
export * from './rpcs';
export * from './selectors';
export * from './sideEffects';
export * from './types';

export const versionCRUDReducer = createCRUDReducer<AnyVersion>(STATE_KEY);

export const updateSettingsReducer: Reducer<VersionState, UpdateSettings<AnyVersionSettings>> = (state, { payload: { id, settings } }) => {
  const version = Utils.normalized.getNormalizedByKey(state, id);

  return Utils.normalized.patchNormalizedByKey(state, id, {
    settings: {
      ...version.settings,
      ...settings,
    },
  });
};

export const updatePublishingReducer: Reducer<VersionState, UpdatePublishing<AnyVersionPublishing>> = (state, { payload: { id, publishing } }) => {
  const version = Utils.normalized.getNormalizedByKey(state, id);

  return Utils.normalized.patchNormalizedByKey(state, id, {
    publishing: {
      ...version.publishing,
      ...publishing,
    },
  });
};

export const updateSessionReducer: Reducer<VersionState, UpdateSession> = (state, { payload: { id, session } }) => {
  const version = Utils.normalized.getNormalizedByKey(state, id);

  return Utils.normalized.patchNormalizedByKey(state, id, {
    session: {
      ...version.session,
      ...session,
    } as AnyVersion['session'],
  });
};

const versionReducer: RootReducer<VersionState, AnyVersionAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VersionAction.UPDATE_SETTINGS:
      return updateSettingsReducer(state, action);
    case VersionAction.UPDATE_PUBLISHING:
      return updatePublishingReducer(state, action);
    case VersionAction.UPDATE_SESSION:
      return updateSessionReducer(state, action);
    default:
      return versionCRUDReducer(state, action);
  }
};

export default versionReducer;
