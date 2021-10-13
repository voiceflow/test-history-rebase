import { Version } from '@voiceflow/google-dfes-types';
import { createSelector } from 'reselect';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { UpdatePublishing, updatePublishingByVersionID, UpdateSettings, updateSettingsByVersionID } from '../actions';
import { activeVersionSelector } from '../selectors/common';
import { DialogflowVersion } from '../types';

// selectors

export const activeDialogflowVersionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<DialogflowVersion>);

export const activeSettingsSelector = createSelector([activeDialogflowVersionSelector], (version) => version?.settings ?? null);

export const activePublishingSelector = createSelector([activeDialogflowVersionSelector], (version) => version?.publishing ?? null);

export const activeLocalesSelector = createSelector([activePublishingSelector], (publishing) => publishing?.locales ?? []);

export const activeInvocationNameSelector = createSelector([activePublishingSelector], (publishing) => publishing?.pronunciation ?? null);

export const activeInvocationsSelector = createSelector([activePublishingSelector], (publishing) => publishing?.sampleInvocations ?? []);

// action creators

export const updateSettings = (
  versionID: string,
  settings: Partial<Version.GoogleDFESVersionSettings>
): UpdateSettings<Version.GoogleDFESVersionSettings> => updateSettingsByVersionID<Version.GoogleDFESVersionSettings>(versionID, settings);

export const updatePublishing = (
  versionID: string,
  publishing: Partial<Version.GoogleDFESVersionPublishing>
): UpdatePublishing<Version.GoogleDFESVersionPublishing> => updatePublishingByVersionID<Version.GoogleDFESVersionPublishing>(versionID, publishing);

// side effects

export const saveSettings =
  (settings: Partial<Version.GoogleDFESVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updateSettings(versionID, settings));
    await client.platform.dialogflow.version.updateSettings(versionID, settings);
  };

export const savePublishing =
  (publishing: Partial<Version.GoogleDFESVersionPublishing>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updatePublishing(versionID, publishing));
    await client.platform.dialogflow.version.updatePublishing(versionID, publishing);
  };
