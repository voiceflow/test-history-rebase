import { Version } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { getActiveVersionContext } from '../utils';

// action creators

/**
 * @deprecated moved to the realtime service
 */
export const updateSettings = (versionID: string, settings: Partial<Version.AlexaVersionSettings>): UpdateSettings<Version.AlexaVersionSettings> =>
  updateSettingsByVersionID<Version.AlexaVersionSettings>(versionID, settings);

/**
 * @deprecated moved to the realtime service
 */
export const updatePublishing = (
  versionID: string,
  publishing: Partial<Version.AlexaVersionPublishing>
): UpdatePublishing<Version.AlexaVersionPublishing> => updatePublishingByVersionID<Version.AlexaVersionPublishing>(versionID, publishing);

// side effects

export const patchSettings =
  (settings: Partial<Version.AlexaVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(updateSettings(versionID, settings));
          await client.platform.alexa.version.updateSettings(versionID, settings);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchSettings({ ...context, settings }));
        }
      )
    );
  };

export const patchPublishing =
  (publishing: Partial<Version.AlexaVersionPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(updatePublishing(versionID, publishing));
          await client.platform.alexa.version.updatePublishing(versionID, publishing);
        },
        async (context) => {
          await dispatch.sync(Realtime.version.patchPublishing({ ...context, publishing }));
        }
      )
    );
  };

export const loadAccountLinking = (): Thunk<Nullable<Version.AccountLinking>> => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);
  const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

  Errors.assertVersionID(versionID);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await client.api.version.get<{ platformData: Version.AlexaVersionData }>(versionID, ['platformData']);

  if (!isAtomicActions) {
    dispatch(updateSettings(versionID, { accountLinking }));
  }

  return accountLinking;
};
