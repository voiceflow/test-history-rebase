import { AccountLinking, AlexaStage, AlexaVersionData, AlexaVersionPublishing, AlexaVersionSettings, Locale } from '@voiceflow/alexa-types';
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

export const activeLocalesSelector = createSelector([activePublishingSelector], (publishing): Locale[] => publishing?.locales ?? []);

export const activeInvocationNameSelector = createSelector([activePublishingSelector], (publishing) => publishing?.invocationName ?? null);

export const activeInvocationsSelector = createSelector([activePublishingSelector], (publishing) => publishing?.invocations ?? []);

export const parentalControlSelector = createSelector(
  [activePublishingSelector, activeLocalesSelector],
  (publishing, locales) => publishing?.forChildren && locales.includes(Locale.EN_US)
);

export const inReviewSelector = createSelector([activeAlexaVersionSelector], (version) => version?.status?.stage === AlexaStage.REVIEW);

// action creators

export const updateSettings = (versionID: string, settings: Partial<AlexaVersionSettings>): UpdateSettings<AlexaVersionSettings> =>
  updateSettingsByVersionID<AlexaVersionSettings>(versionID, settings);

export const updatePublishing = (versionID: string, publishing: Partial<AlexaVersionPublishing>): UpdatePublishing<AlexaVersionPublishing> =>
  updatePublishingByVersionID<AlexaVersionPublishing>(versionID, publishing);

// side effects

export const saveSettings = (settings: Partial<AlexaVersionSettings>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(updateSettings(versionID, settings));
  await client.platform.alexa.version.updateSettings(versionID, settings);
};

export const savePublishing = (publishing: Partial<AlexaVersionPublishing>): Thunk => async (dispatch, getState) => {
  const state = getState();
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertVersionID(versionID);

  dispatch(updatePublishing(versionID, publishing));
  await client.platform.alexa.version.updatePublishing(versionID, publishing);
};

export const loadAccountLinking = (): Thunk<Nullable<AccountLinking>> => async (dispatch, getState) => {
  const versionID = Session.activeVersionIDSelector(getState());

  Errors.assertVersionID(versionID);

  const {
    platformData: {
      settings: { accountLinking },
    },
  } = await client.api.version.get<{ platformData: AlexaVersionData }>(versionID, ['platformData']);

  dispatch(updateSettings(versionID, { accountLinking }));

  return accountLinking;
};
