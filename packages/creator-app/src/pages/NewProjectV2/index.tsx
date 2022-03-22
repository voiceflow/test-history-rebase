import { AlexaUtils } from '@voiceflow/alexa-types';
import { GoogleUtils } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { NewProjectContainer } from './components/Containers';
import { ChannelSection, InvocationNameSection, NLUSection } from './components/Section';
import { getPlatformOrProjectTypeMeta } from './constants';

const NewProject: React.FC = () => {
  const [channel, setChannel] = React.useState<VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType>();
  const [nlu, setNlu] = React.useState<VoiceflowConstants.PlatformType | undefined>();
  const [invocationName, setInvocationName] = React.useState<string>('');

  const isChannelOneClick = isAlexaPlatform(channel) || isGooglePlatform(channel);

  const handleChannelSelect = (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => {
    setChannel(value);
    setNlu(undefined);
  };

  const handleNLUSelect = (value: VoiceflowConstants.PlatformType) => {
    setNlu(value);
  };

  const handleInvocationNameChange = (value: string) => {
    setInvocationName(value);
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
    </NewProjectContainer>
  );
};

export default NewProject;
