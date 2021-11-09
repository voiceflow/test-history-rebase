import { Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { Constants as GeneralConstants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Constants as DialogflowConstants, Version as DialogflowVersion } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants, Version as GoogleVersion } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { SyncThunk, Thunk } from '@/store/types';
import { isAlexaPlatform, isAnyGeneralPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { crud } from '../actions';
import * as alexa from '../platform/alexa';
import * as dialogflow from '../platform/dialogflow';
import * as general from '../platform/general';
import * as google from '../platform/google';

/**
 * @deprecated syncing resource updates is now handled by the realtime service
 */
export const patchActiveVersion =
  (version: Partial<Pick<Realtime.AnyVersion, 'session' | 'settings' | 'publishing'>>, meta?: object): SyncThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertVersionID(versionID);

    dispatch(crud.patch(versionID, version as Partial<Realtime.AnyVersion>, meta));
  };

export const patchSettings =
  (settings: Partial<Realtime.AnyVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);

    if (isAlexaPlatform(platform)) {
      await dispatch(alexa.patchSettings(settings as AlexaVersion.AlexaVersionSettings));
    } else if (isGooglePlatform(platform)) {
      await dispatch(google.patchSettings(settings as GoogleVersion.GoogleVersionSettings));
    } else if (isDialogflowPlatform(platform)) {
      await dispatch(dialogflow.patchSettings(settings as DialogflowVersion.GoogleDFESVersionSettings));
    } else if (isAnyGeneralPlatform(platform)) {
      await dispatch(general.patchSettings(settings as GeneralVersion.GeneralVersionSettings));
    }
  };

export const updateLocales =
  <L extends Realtime.AnyLocale>(locales?: L[]): Thunk =>
  async (dispatch, getState) => {
    if (!locales?.length) return;

    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const platform = ProjectV2.active.platformSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) {
      switch (platform) {
        case GeneralConstants.PlatformType.ALEXA:
          dispatch(alexa.patchPublishing({ locales: locales as unknown as AlexaVersion.AlexaVersionPublishing['locales'] }));
          return;
        case GeneralConstants.PlatformType.GOOGLE:
          dispatch(google.patchPublishing({ locales: locales as GoogleConstants.Locale[] }));
          return;
        case GeneralConstants.PlatformType.DIALOGFLOW_ES_CHAT:
        case GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE:
          dispatch(dialogflow.patchPublishing({ locales: locales as DialogflowConstants.Locale[] }));
          return;
        case GeneralConstants.PlatformType.GENERAL:
        default:
          await dispatch(general.patchSettings({ locales: locales as GeneralConstants.Locale[] }));
      }
    } else {
      Errors.assertVersionID(versionID);

      await client.platform(platform).version.updatePublishing(versionID, { locales: locales as any });

      switch (platform) {
        case GeneralConstants.PlatformType.ALEXA:
          dispatch(alexa.updatePublishing(versionID, { locales: locales as unknown as AlexaVersion.AlexaVersionPublishing['locales'] }));
          return;
        case GeneralConstants.PlatformType.GOOGLE:
          dispatch(google.updatePublishing(versionID, { locales: locales as GoogleConstants.Locale[] }));
          return;
        case GeneralConstants.PlatformType.DIALOGFLOW_ES_CHAT:
        case GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE:
          dispatch(dialogflow.updatePublishing(versionID, { locales: locales as DialogflowConstants.Locale[] }));
          return;
        case GeneralConstants.PlatformType.GENERAL:
        default:
          dispatch(general.updateSettings(versionID, { locales: locales as GeneralConstants.Locale[] }));
      }
    }
  };

export const updateDefaultVoice = (defaultVoice: Realtime.AnyVoice) => patchSettings({ defaultVoice: defaultVoice as any });

export const updateInvocationName =
  (invocationName: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const platform = ProjectV2.active.platformSelector(state);
    const activeInvocationName = VersionV2.active.invocationNameSelector(state) ?? '';
    const activeInvocations = VersionV2.active.invocationsSelector(state);

    Errors.assertVersionID(versionID);

    if (activeInvocationName === invocationName) return;

    // update all the invocation examples when invocation name changes
    const invocations = Utils.string.arrayStringReplace(activeInvocationName, invocationName, activeInvocations);

    switch (platform) {
      case GeneralConstants.PlatformType.ALEXA:
        await dispatch(alexa.patchPublishing({ invocationName, invocations }));
        return;
      case GeneralConstants.PlatformType.GOOGLE:
        await dispatch(google.patchPublishing({ pronunciation: invocationName, sampleInvocations: invocations }));
        return;
      case GeneralConstants.PlatformType.DIALOGFLOW_ES_CHAT:
      case GeneralConstants.PlatformType.DIALOGFLOW_ES_VOICE:
        await dispatch(dialogflow.patchPublishing({ pronunciation: invocationName, sampleInvocations: invocations }));
        // eslint-disable-next-line no-useless-return
        return;
      default: // noop
    }
  };
