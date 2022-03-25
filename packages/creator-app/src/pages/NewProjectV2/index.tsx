import { AlexaUtils } from '@voiceflow/alexa-types';
import { GoogleUtils } from '@voiceflow/google-types';
import { Box } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import LOCALE_MAP from '@/services/LocaleMap';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { NewProjectContainer } from './components/Containers';
import NewProjectModalFooter from './components/NewProjectModalFooter';
import { ChannelSection, InvocationNameSection, LanguageSection, NLUSection } from './components/Section';
import { AnyLanguage, AnyLocale, getPlatformOrProjectTypeMeta } from './constants';

const NewProject: React.FC = () => {
  const [channel, setChannel] = React.useState<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType>();
  const [nlu, setNlu] = React.useState<VoiceflowConstants.PlatformType | undefined>();
  const [invocationName, setInvocationName] = React.useState<string>('');

  const [alexaLocales, setAlexaLocales] = React.useState<AnyLocale[]>([LOCALE_MAP[0].value]);
  const [language, setLanguage] = React.useState<AnyLanguage>();

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

  const handleInvocationNameChange = (value: string) => {
    setInvocationName(value);
  };

  const handleCancel = () => {};

  const handleOnCreate = () => {};

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
              onInvocationNameChange={handleInvocationNameChange}
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

      <NewProjectModalFooter onCreate={handleOnCreate} onCancel={handleCancel} />
    </>
  );
};

export default NewProject;
