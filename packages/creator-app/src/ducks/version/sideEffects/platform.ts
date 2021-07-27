import { AlexaVersionSettings, Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { GeneralVersionSettings, Locale as GeneralLocale } from '@voiceflow/general-types';
import { GoogleVersionSettings, Locale as GoogleLocale } from '@voiceflow/google-types';
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
        return dispatch(alexa.updatePublishing(versionID, { locales: locales as unknown as [AlexaLocale, ...AlexaLocale[]] }));
      case PlatformType.GOOGLE:
        return dispatch(google.updatePublishing(versionID, { locales: locales as GoogleLocale[] }));
      case PlatformType.GENERAL:
      default:
        return dispatch(general.updateSettings(versionID, { locales: locales as GeneralLocale[] }));
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
      await dispatch(alexa.saveSettings(settings as AlexaVersionSettings));
    } else if (isGooglePlatform(platform)) {
      await dispatch(google.saveSettings(settings as GoogleVersionSettings));
    } else if (isAnyGeneralPlatform(platform)) {
      await dispatch(general.saveSettings(settings as GeneralVersionSettings));
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
