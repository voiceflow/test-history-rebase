import { DFESVersion } from '@voiceflow/google-dfes-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';

import { getActivePlatformVersionContext } from '../utils';

// action creators

// side effects

export const patchSettings =
  (settings: Partial<DFESVersion.Settings>): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.patchSettings({ ...getActivePlatformVersionContext(getState()), settings }));
  };

export const patchPublishing =
  (publishing: Partial<DFESVersion.Publishing>): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.version.patchPublishing({ ...getActivePlatformVersionContext(getState()), publishing }));
  };

// TODO: atomic-actions
export const saveTriggerPhrase =
  (triggerPhrase?: string[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeTriggerPhrase = VersionV2.active.dialogflow.triggerPhraseSelector(state);

    Errors.assertVersionID(versionID);

    if (activeTriggerPhrase === triggerPhrase) return;

    await dispatch(patchPublishing({ triggerPhrase }));
  };

export const updateAgentName =
  (agentName?: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const activeAgentName = VersionV2.active.dialogflow.agentNameSelector(state);

    Errors.assertVersionID(versionID);

    if (activeAgentName === agentName) return;

    await dispatch(patchPublishing({ agentName }));
  };
