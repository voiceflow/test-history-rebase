import { Version } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { getActiveVersionContext } from '../utils';

// action creators

/**
 * @deprecated moved to the realtime service
 */
export const updateSettings = (versionID: string, settings: Partial<Version.GoogleVersionSettings>): UpdateSettings<Version.GoogleVersionSettings> =>
  updateSettingsByVersionID<Version.GoogleVersionSettings>(versionID, settings);

/**
 * @deprecated moved to the realtime service
 */
export const updatePublishing = (
  versionID: string,
  publishing: Partial<Version.GoogleVersionPublishing>
): UpdatePublishing<Version.GoogleVersionPublishing> => updatePublishingByVersionID<Version.GoogleVersionPublishing>(versionID, publishing);

// side effects

export const patchSettings =
  (settings: Partial<Version.GoogleVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(updateSettings(versionID, settings));
          await client.platform.google.version.updateSettings(versionID, settings);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchSettings({ ...context, settings }));
        }
      )
    );
  };

export const patchPublishing =
  (publishing: Partial<Version.GoogleVersionPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(updatePublishing(versionID, publishing));
          await client.platform.google.version.updatePublishing(versionID, publishing);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchPublishing({ ...context, publishing }));
        }
      )
    );
  };
