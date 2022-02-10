import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';

import { UpdateSettings, updateSettingsByVersionID } from '../actions';
import { getActiveVersionContext } from '../utils';

// action creators

/**
 * @deprecated moved to the realtime service
 */
export const updateSettings = (versionID: string, settings: Partial<VoiceflowVersion.Settings>): UpdateSettings<VoiceflowVersion.Settings> =>
  updateSettingsByVersionID<VoiceflowVersion.Settings>(versionID, settings);

// side effects

export const patchSettings =
  (settings: Partial<VoiceflowVersion.Settings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(updateSettings(versionID, settings));
          await client.platform.general.version.updateSettings(versionID, settings as VoiceflowVersion.Settings);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchSettings({ ...context, settings }));
        }
      )
    );
  };
