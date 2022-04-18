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
  isPlatformWithInvocationName,
  isVoiceProjectType,
} from '@/utils/typeGuards';

import { NewProjectContainer } from './components/Containers';
import NewProjectModalFooter from './components/NewProjectModalFooter';
import { ChannelSection, InvocationNameSection, LanguageSection, NLUSection } from './components/Section';
import { DEFAULT_PROJECT_NAME, getDefaultLanguage, getLanguage, getPlatformOrProjectTypeMeta } from './constants';
import { AnyLanguage, AnyLocale, ImportModel } from './types';

const getDefaultAlexaVoice = (locale: AlexaConstants.Locale) => {
  return AlexaConstants.DEFAULT_LOCALE_VOICE_MAP[locale] || null;
};

const getDefaultGoogleVoice = (language?: GoogleConstants.Language, locale?: GoogleConstants.Locale) => {
  const languageCode = language || (locale && Object.entries(GoogleConstants.LanguageToLocale).find(([_key, value]) => value.includes(locale))?.[0]);

  return GoogleConstants.DEFAULT_LANGUAGE_VOICE_MAP[languageCode as GoogleConstants.Language] || null;
};

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

interface NewProjectProps {
  onCreatingProject: (val: boolean) => void;
}
const NewProject: React.FC<NewProjectProps> = ({ onCreatingProject }) => {
  const [channel, setChannel] = React.useState<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType>();
  const [nlu, setNlu] = React.useState<VoiceflowConstants.PlatformType | undefined>();
  const [invocationName, setInvocationName] = React.useState<string>('');
  const [isCreateLoading, setIsCreateLoading] = React.useState<boolean>(false);
  const [channelError, setChannelError] = React.useState<boolean>(false);
  const [nluError, setNluError] = React.useState<boolean>(false);
  const [invocationNameError, setInvocationNameError] = React.useState<boolean>(false);
  const [importedModel, setImportedModel] = React.useState<ImportModel>();

  const [alexaLocales, setAlexaLocales] = React.useState<AnyLocale[]>([LOCALE_MAP[0].value]);
  const [language, setLanguage] = React.useState<AnyLanguage>();

  const createProject = useDispatch(Project.createProject);
  const redirectToCanvas = useDispatch(Router.redirectToCanvas);

  const { close: closeProjectCreateModal, data } = useModals<{
    listID?: string;
  }>(ModalType.PROJECT_CREATE_MODAL);

  const handleChannelSelect = (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => {
    setChannel(value !== channel ? value : undefined);
    setLanguage(undefined);
    setChannelError(false);
  };

  const handleNLUSelect = (value: VoiceflowConstants.PlatformType) => {
    setNlu(value !== nlu ? value : undefined);
    setLanguage(undefined);
    setNluError(false);
    setImportedModel(undefined);
  };

  const handleInvocationNameChange = (value: string) => {
    setInvocationName(value);
    setInvocationNameError(false);
  };

  const platformType = React.useMemo(() => {
    if (isChatProjectType(channel) || isVoiceProjectType(channel)) {
      return nlu;
    }
    return channel;
  }, [channel, nlu]);

  const getTemplateTag = () => {
    if (isPlatformWithInvocationName(channel)) {
      return 'default';
    }
    return channel;
  };

  const isVerifyChannel = () => {
    if (!channel) {
      toast.error('Channel selection required');
      setChannelError(true);
      return false;
    }
    return true;
  };

  const isVerifyNlu = () => {
    if (!nlu && !isPlatformWithInvocationName(channel)) {
      toast.error('NLU selection required');
      setNluError(true);
      return false;
    }
    return true;
  };

  const isVerifyInvocationName = () => {
    if (isPlatformWithInvocationName(channel) && (!invocationName || invocationErrorMessage)) {
      setInvocationNameError(true);
      toast.error('Invocation name required');
      return false;
    }
    return true;
  };

  const isVerifySections = [isVerifyChannel, isVerifyNlu, isVerifyInvocationName];

  const verifyCreate = () => {
    let isVerified = true;
    isVerifySections.forEach((isVerifySection) => {
      if (!isVerifySection()) {
        isVerified = false;
      }
    });
    return isVerified;
  };

  const handleOnCreate = async () => {
    if (!verifyCreate()) {
      return;
    }

    let newVersionID: string | null = null;
    const languageToUse: AnyLanguage = language || (getDefaultLanguage(platformType) as AnyLanguage);
    const alexaLocalesToUse: AnyLocale[] = alexaLocales || (getDefaultLanguage(platformType) as AnyLocale[]);

    try {
      setIsCreateLoading(true);
      onCreatingProject(true);

      const project = await createProject(
        {
          name: DEFAULT_PROJECT_NAME,
          listID: data.listID,
          platform: platformType,
          language: getLanguage(languageToUse!, alexaLocalesToUse, platformType!),
          onboarding: false,
        },
        getTemplateTag()
      );
      newVersionID = project.versionID;

      // TODO: in the future make new project parameters much more platform specific
      if (isAlexaPlatform(platformType)) {
        await updateAlexaMeta(newVersionID, alexaLocalesToUse as [AlexaConstants.Locale, ...AlexaConstants.Locale[]], invocationName);
      } else if (isGooglePlatform(platformType)) {
        await updateGoogleMeta(newVersionID, languageToUse as GoogleConstants.Language, invocationName);
      } else if (isDialogflowPlatform(platformType)) {
        await updateDialogFlowMeta(newVersionID, languageToUse as DFESConstants.Language);
      } else {
        await updateGeneralMeta(newVersionID, languageToUse as VoiceflowConstants.Locale);
      }

      if (importedModel && platformType && getPlatformOrProjectTypeMeta[platformType]?.importMeta)
        await client.version.patchMergeIntentsAndSlots(newVersionID, importedModel);
    } finally {
      setIsCreateLoading(false);
      closeProjectCreateModal();
      onCreatingProject(false);
    }

    if (newVersionID) {
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
          <ChannelSection channelValue={channel} onChannelSelect={handleChannelSelect} channelError={channelError} />

          {isPlatformWithInvocationName(channel) ? (
            <InvocationNameSection
              invocationName={invocationName}
              onInvocationNameChange={handleInvocationNameChange}
              invocationDescription={channel ? getPlatformOrProjectTypeMeta[channel]?.invocationDescription : ''}
              invocationError={!!invocationErrorMessage || invocationNameError}
              invocationErrorMessage={invocationErrorMessage}
            />
          ) : (
            <NLUSection
              nluValue={nlu}
              onNluSelect={handleNLUSelect}
              nluError={nluError}
              importModel={importedModel}
              onImportModel={setImportedModel}
            />
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

      <NewProjectModalFooter onCreate={handleOnCreate} onCancel={closeProjectCreateModal} isCreateLoading={isCreateLoading} />
    </>
  );
};

export default NewProject;
