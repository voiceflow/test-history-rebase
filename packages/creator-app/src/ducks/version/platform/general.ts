import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

// action creators

// side effects

export const patchSettings =
  (settings: Partial<VoiceflowVersion.Settings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch.sync(Realtime.version.patchSettings({ ...getActivePlatformVersionContext(getState()), settings }));
  };

export const patchDefaultStepColors =
  (defaultStepColors: Realtime.Version.DefaultStepColors): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch.sync(Realtime.version.patchDefaultStepColors({ ...getActivePlatformVersionContext(getState()), defaultStepColors }));
  };
