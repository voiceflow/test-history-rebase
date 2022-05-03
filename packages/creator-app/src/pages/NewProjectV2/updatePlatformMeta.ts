import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import { DEFAULT_PROJECT_NAME } from '@/pages/NewProjectV2/constants';

const getDefaultAlexaVoice = (locale: AlexaConstants.Locale) => {
  return AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null;
};

const getDefaultGoogleVoice = (language?: GoogleConstants.Language, locale?: GoogleConstants.Locale) => {
  const languageCode = language || (locale && Object.entries(GoogleConstants.LanguageToLocale).find(([_key, value]) => value.includes(locale))?.[0]);

  return GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[languageCode as GoogleConstants.Language] || null;
};

export const updatePlatformMetaCalls = () => {
  const updateAlexaMeta = async (versionID: string, locales: [AlexaConstants.Locale, ...AlexaConstants.Locale[]], invocationName?: string) => {
    const defaultVoice = getDefaultAlexaVoice(locales[0]);

    await Promise.all([
      client.platform.alexa.version.updatePublishing(versionID, {
        invocationName,
        invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        locales,
      }),
      defaultVoice && client.platform.alexa.version.updateSettings(versionID!, { defaultVoice }),
    ]);
  };

  const updateGoogleMeta = async (versionID: string, googleLanguage: GoogleConstants.Language, invocationName?: string) => {
    const defaultVoice = getDefaultGoogleVoice(googleLanguage) as Nullable<GoogleConstants.Voice>;
    await Promise.all([
      client.platform.google.version.updatePublishing(versionID, {
        locales: GoogleConstants.LanguageToLocale[googleLanguage],
        displayName: DEFAULT_PROJECT_NAME,
        pronunciation: invocationName,
        sampleInvocations: [`Talk to ${invocationName}`],
      }),
      defaultVoice && client.platform.google.version.updateSettings(versionID!, { defaultVoice }),
    ]);
  };

  const updateDialogFlowMeta = async (versionID: string, dialogFlowLanguage: DFESConstants.Language) => {
    await client.platform.dialogflow.version.updatePublishing(versionID, {
      locales: DFESConstants.LanguageToLocale[dialogFlowLanguage],
    });
  };

  const updateGeneralMeta = async (versionID: string, generalLocale: VoiceflowConstants.Locale) => {
    const firstAlexaVoice = getDefaultAlexaVoice(generalLocale as unknown as AlexaConstants.Locale);
    const firstGoogleVoice = !firstAlexaVoice && getDefaultGoogleVoice(undefined, generalLocale as unknown as GoogleConstants.Locale);
    const defaultVoice = firstAlexaVoice || firstGoogleVoice || undefined;

    await client.platform.general.version.updateSettings(versionID, {
      locales: [generalLocale],
      defaultVoice: defaultVoice ? (defaultVoice as unknown as Nullable<GoogleConstants.Voice>) : undefined,
    });
  };

  return {
    updateAlexaMeta,
    updateGoogleMeta,
    updateDialogFlowMeta,
    updateGeneralMeta,
  };
};
