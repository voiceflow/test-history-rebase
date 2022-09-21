import { AlexaConstants } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import { DEFAULT_PROJECT_NAME } from '@/pages/NewProjectV2/constants';

const getDefaultAlexaVoice = (locale: AlexaConstants.Locale) => AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null;

const getDefaultGoogleVoice = (language?: GoogleConstants.Language, locale?: GoogleConstants.Locale): Nullable<GoogleConstants.Voice> => {
  let languageCode: Nullable<GoogleConstants.Language> = language ?? null;

  if (!languageCode && locale) {
    languageCode = (Object.values(GoogleConstants.LanguageToLocale).find((value) => value.includes(locale))?.[0] ??
      null) as GoogleConstants.Language | null;
  }

  return (languageCode && (GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[languageCode] as GoogleConstants.Voice)) || null;
};

export const updatePlatformMetaCalls = () => {
  const updateAlexaMeta = async (versionID: string, locales: [AlexaConstants.Locale, ...AlexaConstants.Locale[]], invocationName?: string) => {
    const defaultVoice = getDefaultAlexaVoice(locales[0]);

    await Promise.all([
      client.platform.alexa.version.updatePublishing(versionID, {
        locales,
        invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
        invocationName,
      }),
      defaultVoice && client.platform.alexa.version.updateSettings(versionID!, { defaultVoice }),
    ]);
  };

  const updateGoogleMeta = async (versionID: string, googleLanguage: GoogleConstants.Language, invocationName?: string) => {
    const defaultVoice = getDefaultGoogleVoice(googleLanguage);

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
    await client.platform.dialogflowES.version.updatePublishing(versionID, {
      locales: DFESConstants.LanguageToLocale[dialogFlowLanguage],
    });
  };

  const updateGeneralMeta = async (versionID: string, generalLocale: VoiceflowConstants.Locale) => {
    const firstAlexaVoice = getDefaultAlexaVoice(generalLocale as unknown as AlexaConstants.Locale);
    const firstGoogleVoice = !firstAlexaVoice && getDefaultGoogleVoice(undefined, generalLocale as unknown as GoogleConstants.Locale);
    const defaultVoice = firstAlexaVoice || firstGoogleVoice || undefined;

    await client.platform.general.version.updateSettings(versionID, {
      locales: [generalLocale],
      defaultVoice: defaultVoice ? (defaultVoice as unknown as VoiceflowConstants.Voice) : undefined,
    });
  };

  return {
    updateAlexaMeta,
    updateGoogleMeta,
    updateGeneralMeta,
    updateDialogFlowMeta,
  };
};
