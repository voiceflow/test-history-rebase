import { Constants, Version } from '@voiceflow/alexa-types';
import { createSelector } from 'reselect';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { activeVersionSelector } from '../selectors/common';
import { AlexaVersion } from '../types';

// selectors

export const activeAlexaVersionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<AlexaVersion>);

export const activeSettingsSelector = createSelector([activeAlexaVersionSelector], (version) => version?.settings ?? null);

export const activeModelSensitivitySelector = createSelector([activeSettingsSelector], (settings) => settings?.modelSensitivity ?? null);

export const activeCustomInterfaceSelector = createSelector([activeSettingsSelector], (settings) => settings?.customInterface ?? null);

export const eventsSelector = createSelector([activeSettingsSelector], (settings) => settings?.events ?? null);

export const accountLinkingSelector = createSelector([activeSettingsSelector], (settings) => settings?.accountLinking ?? null);

export const activePublishingSelector = createSelector([activeAlexaVersionSelector], (version) => version?.publishing ?? null);

export const activeLocalesSelector = createSelector([activePublishingSelector], (publishing): Constants.Locale[] => publishing?.locales ?? []);

export const activeInvocationNameSelector = createSelector([activePublishingSelector], (publishing) => publishing?.invocationName ?? null);

export const activeInvocationsSelector = createSelector([activePublishingSelector], (publishing) => publishing?.invocations ?? []);

export const parentalControlSelector = createSelector(
  [activePublishingSelector, activeLocalesSelector],
  (publishing, locales) => publishing?.forChildren && locales.includes(Constants.Locale.EN_US)
);

export const inReviewSelector = createSelector([activeAlexaVersionSelector], (version) => version?.status?.stage === Version.AlexaStage.REVIEW);

// action creators

export const updateSettings = (versionID: string, settings: Partial<Version.AlexaVersionSettings>): UpdateSettings<Version.AlexaVersionSettings> =>
  updateSettingsByVersionID<Version.AlexaVersionSettings>(versionID, settings);

export const updatePublishing = (
  versionID: string,
  publishing: Partial<Version.AlexaVersionPublishing>
): UpdatePublishing<Version.AlexaVersionPublishing> => updatePublishingByVersionID<Version.AlexaVersionPublishing>(versionID, publishing);

// side effects

export const saveSettings =
  (settings: Partial<Version.AlexaVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updateSettings(versionID, settings));
    await client.platform.alexa.version.updateSettings(versionID, settings);
  };

export const savePublishing =
  (publishing: Partial<Version.AlexaVersionPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updatePublishing(versionID, publishing));
    await client.platform.alexa.version.updatePublishing(versionID, publishing);
  };

export const loadAccountLinking = (): Thunk<Nullable<Version.AccountLinking>> => async (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await client.api.version.get<{ platformData: Version.AlexaVersionData }>(versionID, ['platformData']);

  dispatch(updateSettings(versionID, { accountLinking }));

  return accountLinking;
};
