import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import * as Project from '@/ducks/projectV2';
import { trackWebchatCustomization } from '@/ducks/tracking';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

// action creators

// side effects

export const patchSettings =
  (settings: Partial<VoiceflowVersion.Settings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.version.patchSettings({ ...getActivePlatformVersionContext(state), settings }));
  };

export const patchPublishing =
  (publishing: Partial<VoiceflowVersion.ChatPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.version.patchPublishing({ ...getActivePlatformVersionContext(state), publishing }));
  };

export const patchActiveAndLivePublishing =
  (publishing: Partial<VoiceflowVersion.ChatPublishing>, track = true): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const activeContext = getActivePlatformVersionContext(state);

    const actions = [dispatch.sync(Realtime.version.patchPublishing({ ...activeContext, publishing }))];

    const liveVersion = Project.active.liveVersionSelector(state);
    if (liveVersion) {
      actions.push(dispatch.sync(Realtime.version.patchPublishing({ ...activeContext, versionID: liveVersion, publishing })));
    }

    await Promise.all(actions);

    if (track) {
      Object.keys(publishing).forEach((element) => dispatch(trackWebchatCustomization({ element })));
    }
  };

export const patchDefaultStepColors =
  (defaultStepColors: Realtime.Version.DefaultStepColors): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.version.patchDefaultStepColors({ ...getActivePlatformVersionContext(state), defaultStepColors }));
  };
