import { Constants as AlexaConstants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Constants as GeneralConstants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Constants as GoogleConstants, Version as GoogleVersion } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';

import * as Errors from '@/config/errors';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';
import { arrayStringReplace } from '@/utils/string';
import { isAlexaPlatform, isAnyGeneralPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { patchVersion } from '../actions';
import * as alexa from '../platform/alexa';
import * as general from '../platform/general';
import * as google from '../platform/google';
import { activeInvocationNameSelector, activeInvocationsSelector, versionByIDSelector } from '../selectors';
import { AnyLocale, AnySettings, AnyVersion, AnyVoice } from '../types';

export const updateLocalesByVersionID =
  <L extends AnyLocale>(versionID: string, locales: L[]): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const version = versionByIDSelector(state)(versionID);
    const project = Project.projectByIDSelector(state)(version.projectID);

    switch (project.platform) {
      case PlatformType.ALEXA:
        return dispatch(alexa.updatePublishing(versionID, { locales: locales as unknown as [AlexaConstants.Locale, ...AlexaConstants.Locale[]] }));
      case PlatformType.GOOGLE:
        return dispatch(google.updatePublishing(versionID, { locales: locales as GoogleConstants.Locale[] }));
      case PlatformType.GENERAL:
      default:
        return dispatch(general.updateSettings(versionID, { locales: locales as GeneralConstants.Locale[] }));
    }
  };

export const patchActiveVersion =
  (version: Partial<Pick<AnyVersion, 'session' | 'settings' | 'publishing'>>, meta?: object): SyncThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(patchVersion(versionID, version as Partial<AnyVersion>, meta));
  };

export const saveSettings =
  (settings: Partial<AnySettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);

    if (isAlexaPlatform(platform)) {
      await dispatch(alexa.saveSettings(settings as AlexaVersion.AlexaVersionSettings));
    } else if (isGooglePlatform(platform)) {
      await dispatch(google.saveSettings(settings as GoogleVersion.GoogleVersionSettings));
    } else if (isAnyGeneralPlatform(platform)) {
      await dispatch(general.saveSettings(settings as GeneralVersion.GeneralVersionSettings));
    }
  };

export const saveDefaultVoice = (defaultVoice: AnyVoice) => saveSettings({ defaultVoice: defaultVoice as any });

export const saveInvocationName =
  (invocationName: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const platform = Project.activePlatformSelector(state);
    const activeInvocationName = activeInvocationNameSelector(state) ?? '';
    const activeInvocations = activeInvocationsSelector(state);

    Errors.assertVersionID(versionID);

    if (activeInvocationName === invocationName) return;

    // update all the invocation examples when invocation name changes
    const invocations = arrayStringReplace(activeInvocationName, invocationName, activeInvocations);

    if (platform === PlatformType.ALEXA) {
      await dispatch(alexa.savePublishing({ invocationName, invocations }));
    } else if (platform === PlatformType.GOOGLE) {
      await dispatch(google.savePublishing({ pronunciation: invocationName, sampleInvocations: invocations }));
    }
  };
