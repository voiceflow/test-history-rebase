import { GoogleVersionPublishing, GoogleVersionSettings } from '@voiceflow/google-types';
import { createSelector } from 'reselect';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { activeVersionSelector } from '../selectors/common';
import { GoogleVersion } from '../types';

// selectors

export const activeGoogleVersionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<GoogleVersion>);

export const activeSettingsSelector = createSelector([activeGoogleVersionSelector], (version) => version?.settings ?? null);

export const activePublishingSelector = createSelector([activeGoogleVersionSelector], (version) => version?.publishing ?? null);

export const activeLocalesSelector = createSelector([activePublishingSelector], (publishing) => publishing?.locales ?? []);

export const activeInvocationNameSelector = createSelector([activePublishingSelector], (publishing) => publishing?.pronunciation ?? null);

export const activeInvocationsSelector = createSelector([activePublishingSelector], (publishing) => publishing?.sampleInvocations ?? []);

// action creators

export const updateSettings = (versionID: string, settings: Partial<GoogleVersionSettings>): UpdateSettings<GoogleVersionSettings> =>
  updateSettingsByVersionID<GoogleVersionSettings>(versionID, settings);

export const updatePublishing = (versionID: string, publishing: Partial<GoogleVersionPublishing>): UpdatePublishing<GoogleVersionPublishing> =>
  updatePublishingByVersionID<GoogleVersionPublishing>(versionID, publishing);

// side effects

export const saveSettings =
  (settings: Partial<GoogleVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updateSettings(versionID, settings));
    await client.platform.google.version.updateSettings(versionID, settings);
  };

export const savePublishing =
  (publishing: Partial<GoogleVersionPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updatePublishing(versionID, publishing));
    await client.platform.google.version.updatePublishing(versionID, publishing);
  };
