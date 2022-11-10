import { AlexaVersion } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { DFESConstants, DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleVersion } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';

import * as Errors from '@/config/errors';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { Thunk } from '@/store/types';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import * as alexa from '../platform/alexa';
import * as dialogflow from '../platform/dialogflow';
import * as general from '../platform/general';
import * as google from '../platform/google';

export const patchSettings =
  (settings: Partial<Realtime.AnyVersionSettings>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);

    if (isAlexaPlatform(platform)) {
      await dispatch(alexa.patchSettings(settings as AlexaVersion.Settings));
    } else if (isGooglePlatform(platform)) {
      await dispatch(google.patchSettings(settings as GoogleVersion.VoiceSettings));
    } else if (isDialogflowPlatform(platform)) {
      await dispatch(dialogflow.patchSettings(settings as DFESVersion.Settings));
    } else {
      await dispatch(general.patchSettings(settings as VoiceflowVersion.Settings));
    }
  };

export const patchDefaultStepColors =
  (defaultStepColors: Realtime.Version.DefaultStepColors): Thunk =>
  async (dispatch) => {
    await dispatch(general.patchDefaultStepColors(defaultStepColors));
  };

export const updateLocales =
  <L extends Realtime.AnyLocale>(locales?: L[]): Thunk =>
  async (dispatch, getState) => {
    if (!locales?.length) return;

    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);

    switch (platform) {
      case Platform.Constants.PlatformType.ALEXA:
        dispatch(alexa.patchPublishing({ locales: locales as unknown as AlexaVersion.Publishing['locales'] }));
        return;
      case Platform.Constants.PlatformType.GOOGLE:
        dispatch(google.patchPublishing({ locales: locales as GoogleConstants.Locale[] }));
        return;
      case Platform.Constants.PlatformType.DIALOGFLOW_ES:
        dispatch(dialogflow.patchPublishing({ locales: locales as DFESConstants.Locale[] }));
        return;
      case Platform.Constants.PlatformType.VOICEFLOW:
      default:
        await dispatch(general.patchSettings({ locales: locales as VoiceflowConstants.Locale[] }));
    }
  };

export const updateDefaultVoice = (defaultVoice: string) => patchSettings({ defaultVoice: defaultVoice as any });

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
      case Platform.Constants.PlatformType.ALEXA:
        await dispatch(alexa.patchPublishing({ invocationName, invocations }));
        return;
      case Platform.Constants.PlatformType.GOOGLE:
        await dispatch(google.patchPublishing({ pronunciation: invocationName, sampleInvocations: invocations }));
        return;
      case Platform.Constants.PlatformType.DIALOGFLOW_ES:
        await dispatch(dialogflow.patchPublishing({ pronunciation: invocationName, sampleInvocations: invocations }));
        // eslint-disable-next-line no-useless-return
        return;
      default: // noop
    }
  };
