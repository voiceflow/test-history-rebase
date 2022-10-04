import { AlexaConstants, AlexaUtils } from '@voiceflow/alexa-types';
import { Nullable } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleUtils } from '@voiceflow/google-types';
import { Box, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import { useDispatch, useModelTracking, useTrackingEvents } from '@/hooks';
import LOCALE_MAP from '@/services/LocaleMap';
import {
  isAlexaPlatform,
  isChatProjectType,
  isDialogflowPlatform,
  isGooglePlatform,
  isPlatformWithInvocationName,
  isVoiceProjectType,
} from '@/utils/typeGuards';

import { ChannelSection, Container, Footer, InvocationNameSection, LanguageSection, NLUSection } from './components';
import { DEFAULT_PROJECT_NAME, getDefaultLanguage, getLanguage, PLATFORM_PROJECT_META_MAP } from './constants';
import { AnyLanguage, AnyLocale, ImportModel, SupportedPlatformProjectType, SupportedPlatformType } from './types';
import { updatePlatformMetaCalls } from './updatePlatformMeta';

interface NewProjectProps {
  onToggleCreating: (val: boolean) => void;
  onClose: VoidFunction;
  listID?: string;
}

const NewProject: React.FC<NewProjectProps> = ({ onToggleCreating, onClose, listID }) => {
  const [nlu, setNlu] = React.useState<Nullable<SupportedPlatformType>>(null);
  const [channel, setChannel] = React.useState<Nullable<SupportedPlatformProjectType>>(null);
  const [language, setLanguage] = React.useState<Nullable<AnyLanguage>>(null);
  const [nluError, setNluError] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [alexaLocales, setAlexaLocales] = React.useState<AnyLocale[]>([LOCALE_MAP[0].value]);
  const [channelError, setChannelError] = React.useState(false);
  const [importedModel, setImportedModel] = React.useState<Nullable<ImportModel>>(null);
  const [invocationName, setInvocationName] = React.useState('');
  const [invocationNameError, setInvocationNameError] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();
  const modelImportTracking = useModelTracking();

  const createProject = useDispatch(Project.createProject);
  const redirectToDomain = useDispatch(Router.redirectToDomain);

  const { updateDialogFlowMeta, updateGeneralMeta, updateAlexaMeta, updateGoogleMeta } = updatePlatformMetaCalls();

  const invocationErrorMessage = React.useMemo(() => {
    if (!invocationName || !channel) return '';

    if (channel === VoiceflowConstants.PlatformType.ALEXA) return AlexaUtils.getInvocationNameError(invocationName, alexaLocales) ?? '';
    if (channel === VoiceflowConstants.PlatformType.GOOGLE)
      return GoogleUtils.getInvocationNameError(invocationName, GoogleConstants.LanguageToLocale[language as GoogleConstants.Language]) ?? '';

    return '';
  }, [channel, language, alexaLocales, invocationName]);

  const onChannelSelect = (value: SupportedPlatformProjectType) => {
    setChannel(value !== channel ? value : null);
    setLanguage(null);
    setChannelError(false);
  };

  const onNLUSelect = (value: SupportedPlatformType) => {
    setNlu(value !== nlu ? value : null);
    setLanguage(null);
    setNluError(false);
    setImportedModel(null);
  };

  const onInvocationNameChange = (value: string) => {
    setInvocationName(value);
    setInvocationNameError(false);
  };

  const validateData = () => {
    let isVerified = true;

    if (!channel) {
      isVerified = false;
      toast.error('Channel selection required');
      setChannelError(true);
    }

    if (!nlu && !isPlatformWithInvocationName(channel)) {
      isVerified = false;
      toast.error('NLU selection required');
      setNluError(true);
    }

    if (isPlatformWithInvocationName(channel) && (!invocationName || invocationErrorMessage)) {
      isVerified = false;
      setInvocationNameError(true);
      toast.error('Invocation name required');
    }

    return isVerified;
  };

  const handleOnCreate = async () => {
    if (!validateData()) return;

    const platformType = isChatProjectType(channel) || isVoiceProjectType(channel) ? nlu : channel;

    let newVersionID: Nullable<string> = null;
    const languageToUse: AnyLanguage = language || (getDefaultLanguage(platformType) as AnyLanguage);
    const alexaLocalesToUse: AnyLocale[] = alexaLocales || (getDefaultLanguage(platformType) as AnyLocale[]);

    try {
      onToggleCreating(true);
      setIsCreating(true);

      const project = await createProject(
        {
          name: DEFAULT_PROJECT_NAME,
          listID,
          platform: platformType!,
          language: getLanguage(languageToUse!, alexaLocalesToUse, platformType!),
          onboarding: false,
        },
        isPlatformWithInvocationName(channel) ? 'default' : channel!
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

      if (importedModel && platformType && PLATFORM_PROJECT_META_MAP[platformType]?.importMeta) {
        await client.version.patchMergeIntentsAndSlots(newVersionID, importedModel);

        modelImportTracking(platformType, importedModel, trackingEvents, project.id);
      }
    } finally {
      onClose();
      setIsCreating(false);
    }

    if (newVersionID) {
      redirectToDomain({ versionID: newVersionID });
    }
  };

  return (
    <>
      <Box fullWidth overflow="auto">
        <Container>
          <ChannelSection value={channel} onSelect={onChannelSelect} error={channelError} />

          {isPlatformWithInvocationName(channel) ? (
            <InvocationNameSection
              value={invocationName}
              error={!!invocationErrorMessage || invocationNameError}
              onChange={onInvocationNameChange}
              description={channel ? PLATFORM_PROJECT_META_MAP[channel]?.invocationDescription : ''}
              errorMessage={invocationErrorMessage}
            />
          ) : (
            <NLUSection value={nlu} onSelect={onNLUSelect} error={nluError} importModel={importedModel} onImportModel={setImportedModel} />
          )}

          <LanguageSection
            nlu={nlu}
            channel={channel}
            language={language}
            setLanguage={setLanguage}
            alexaLocales={alexaLocales}
            setAlexaLocales={setAlexaLocales}
          />
        </Container>
      </Box>

      <Footer onCreate={handleOnCreate} onCancel={onClose} isCreating={isCreating} />
    </>
  );
};

export default NewProject;
