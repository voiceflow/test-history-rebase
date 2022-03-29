import { AlexaConstants, AlexaUtils } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleUtils } from '@voiceflow/google-types';
import { Box, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import { ModalType } from '@/constants';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch, useModals } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import { getPlatformValue } from '@/utils/platform';
import {
  isAlexaPlatform,
  isChatProjectType,
  isDialogflowPlatform,
  isGooglePlatform,
  isVoiceflowPlatform,
  isVoiceProjectType,
} from '@/utils/typeGuards';

import { NewProjectContainer } from './components/Containers';
import NewProjectModalFooter from './components/NewProjectModalFooter';
import { ChannelSection, InvocationNameSection, LanguageSection, NLUSection } from './components/Section';
import { DEFAULT_PROJECT_NAME, getLanguage, getPlatformOrProjectTypeMeta } from './constants';
import { AnyLanguage, AnyLocale } from './types';

const getDefaultAlexaVoice = (locale: AlexaConstants.Locale) => {
  return AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null;
};

const getDefaultGoogleVoice = (language?: GoogleConstants.Language, locale?: GoogleConstants.Locale) => {
  const languageCode = language || (locale && Object.entries(GoogleConstants.LanguageToLocale).find(([_key, value]) => value.includes(locale))?.[0]);

  return GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[languageCode as GoogleConstants.Language] || null;
};

const updateAlexaMeta = async (versionID: string, locales: AlexaConstants.Locale[], invocationName?: string) => {
  const defaultVoice = getDefaultAlexaVoice(locales[0]);

  await Promise.all([
    client.platform.alexa.version.updatePublishing(versionID, {
      invocationName,
      invocations: [`open ${invocationName}`, `start ${invocationName}`, `launch ${invocationName}`],
      // @ts-expect-error temp ignore type issue for now
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

const NewProject: React.FC = () => {
  const [channel, setChannel] = React.useState<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType>();
  const [nlu, setNlu] = React.useState<VoiceflowConstants.PlatformType | undefined>();
  const [invocationName, setInvocationName] = React.useState<string>('');
  const [isCreateLoading, setIsCreateLoading] = React.useState<boolean>(false);

  const [alexaLocales, setAlexaLocales] = React.useState<AnyLocale[]>([LOCALE_MAP[0].value]);
  const [language, setLanguage] = React.useState<AnyLanguage>();

  const createProject = useDispatch(Project.createProject);
  const redirectToCanvas = useDispatch(Router.redirectToCanvas);

  const { close: closeConnectModal, data } = useModals<{
    listID: string;
  }>(ModalType.PROJECT_CREATE_MODAL);

  const isChannelOneClick = isAlexaPlatform(channel) || isGooglePlatform(channel);

  const handleChannelSelect = (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => {
    setChannel(value !== channel ? value : undefined);
    setNlu(undefined);
    setLanguage(undefined);
  };

  const handleNLUSelect = (value: VoiceflowConstants.PlatformType) => {
    setNlu(value);
    setLanguage(undefined);
  };

  const platformType = React.useMemo(() => {
    if (isChatProjectType(channel) || isVoiceProjectType(channel)) {
      return nlu;
    }
    return channel;
  }, [channel, nlu]);

  const getTemplateTag = () => {
    if (isChannelOneClick) {
      return 'default';
    }
    return channel;
  };

  const verifyLanguage = () => {
    if (isAlexaPlatform(channel)) {
      return alexaLocales.length > 0;
    }
    return !!language;
  };

  const verifyCreate = () => {
    if (isChannelOneClick && invocationName && !invocationErrorMessage && verifyLanguage()) {
      return true;
    }
    if (channel && nlu && verifyLanguage()) {
      return true;
    }
    toast.error('Missing fields');
    return false;
  };

  const handleOnCreate = async () => {
    if (!verifyCreate()) {
      return;
    }

    let newVersionID: string | null = null;

    try {
      setIsCreateLoading(true);
      const project = await createProject(
        {
          name: DEFAULT_PROJECT_NAME,
          listID: data.listID,
          platform: platformType,
          language: getLanguage(language!, alexaLocales, platformType!),
          onboarding: false,
        },
        getTemplateTag()
      );
      newVersionID = project.versionID;

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(platformType)) {
        await updateAlexaMeta(newVersionID, alexaLocales, invocationName);
      } else if (isGooglePlatform(platformType)) {
        await updateGoogleMeta(newVersionID, language as GoogleConstants.Language, invocationName);
      } else if (isDialogflowPlatform(platformType)) {
        await updateDialogFlowMeta(newVersionID, language as DFESConstants.Language);
      } else if (isVoiceflowPlatform(platformType)) {
        await updateGeneralMeta(newVersionID, language as VoiceflowConstants.Locale);
      }
    } finally {
      setIsCreateLoading(false);
    }

    if (newVersionID) {
      closeConnectModal();
      redirectToCanvas(newVersionID);
    }
  };

  const invocationErrorMessage =
    invocationName &&
    channel &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      channel as VoiceflowConstants.PlatformType,
      {
        [VoiceflowConstants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      () => ''
    )(invocationName);

  return (
    <>
      <Box fullWidth overflow="auto">
        <NewProjectContainer>
          <ChannelSection channelValue={channel} onChannelSelect={handleChannelSelect} />

          {isChannelOneClick ? (
            <InvocationNameSection
              invocationName={invocationName}
              onInvocationNameChange={setInvocationName}
              invocationDescription={channel ? getPlatformOrProjectTypeMeta[channel]?.invocationDescription : ''}
              invocationError={!!invocationErrorMessage}
              invocationErrorMessage={invocationErrorMessage}
            />
          ) : (
            <NLUSection nluValue={nlu} onNluSelect={handleNLUSelect} />
          )}

          <LanguageSection
            language={language}
            setLanguage={setLanguage}
            alexaLocales={alexaLocales}
            setAlexaLocales={setAlexaLocales}
            channel={channel}
            nlu={nlu}
          />
        </NewProjectContainer>
      </Box>

      <NewProjectModalFooter onCreate={handleOnCreate} onCancel={closeConnectModal} isCreateLoading={isCreateLoading} />
    </>
  );
};

export default NewProject;
