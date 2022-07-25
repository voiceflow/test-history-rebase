import { GoogleVersion } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

// action creators

// side effects

export const patchSettings =
  (settings: Partial<GoogleVersion.VoiceSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch.sync(Realtime.version.patchSettings({ ...getActivePlatformVersionContext(getState()), settings }));
  };

export const patchPublishing =
  (publishing: Partial<GoogleVersion.VoicePublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch.sync(Realtime.version.patchPublishing({ ...getActivePlatformVersionContext(getState()), publishing }));
  };
