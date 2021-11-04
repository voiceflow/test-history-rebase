import { Version } from '@voiceflow/google-dfes-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { getActiveVersionContext } from '../utils';

// action creators

/**
 * @deprecated moved to the realtime service
 */
export const updateSettings = (
  versionID: string,
  settings: Partial<Version.GoogleDFESVersionSettings>
): UpdateSettings<Version.GoogleDFESVersionSettings> => updateSettingsByVersionID<Version.GoogleDFESVersionSettings>(versionID, settings);

/**
 * @deprecated moved to the realtime service
 */
export const updatePublishing = (
  versionID: string,
  publishing: Partial<Version.GoogleDFESVersionPublishing>
): UpdatePublishing<Version.GoogleDFESVersionPublishing> => updatePublishingByVersionID<Version.GoogleDFESVersionPublishing>(versionID, publishing);

// side effects

export const patchSettings =
  (settings: Partial<Version.GoogleDFESVersionSettings>): Thunk =>
  async (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const versionID = Session.activeVersionIDSelector(getState());

          Errors.assertVersionID(versionID);

          dispatch(updateSettings(versionID, settings));
          await client.platform.dialogflow.version.updateSettings(versionID, settings);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchSettings({ ...context, settings }));
        }
      )
    );

export const patchPublishing =
  (publishing: Partial<Version.GoogleDFESVersionPublishing>): Thunk =>
  async (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const versionID = Session.activeVersionIDSelector(getState());

          Errors.assertVersionID(versionID);

          dispatch(updatePublishing(versionID, publishing));
          await client.platform.dialogflow.version.updatePublishing(versionID, publishing);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchPublishing({ ...context, publishing }));
        }
      )
    );

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
