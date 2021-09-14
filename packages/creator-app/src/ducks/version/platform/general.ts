import { Version } from '@voiceflow/general-types';
import { createSelector } from 'reselect';

import client from '@/client';
import * as Errors from '@/config/errors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { Nullable } from '@/types';

import { UpdateSettings, updateSettingsByVersionID } from '../actions';
import { activeVersionSelector } from '../selectors/common';
import { GeneralVersion } from '../types';

// selectors

export const activeGeneralVersionSelector = createSelector([activeVersionSelector], (version) => version as Nullable<GeneralVersion>);

export const activeSettingsSelector = createSelector([activeGeneralVersionSelector], (version) => version?.settings ?? null);

export const activeLocalesSelector = createSelector([activeSettingsSelector], (settings) => settings?.locales ?? []);

export const activeInvocationNameSelector = ProjectV2.active.nameSelector;

// action creators

export const updateSettings = (
  versionID: string,
  settings: Partial<Version.GeneralVersionSettings>
): UpdateSettings<Version.GeneralVersionSettings> => updateSettingsByVersionID<Version.GeneralVersionSettings>(versionID, settings);

// side effects

export const saveSettings =
  (settings: Partial<Version.GeneralVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(updateSettings(versionID, settings));
    await client.platform.general.version.updateSettings(versionID, settings);
  };
