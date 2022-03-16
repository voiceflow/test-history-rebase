import { AlexaUtils } from '@voiceflow/alexa-types';
import { GoogleUtils } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getPlatformValue } from '@/utils/platform';

import { NewProjectContainer } from './components/Containers';
import { ChannelSection, InvocationNameSection, NLUSection } from './components/Section';
import { ChannelSectionType, ChannelType, channelTypeToPlatformType, getChannelMeta, NLUType } from './constants';

const NewProject: React.FC = () => {
  const [channel, setChannel] = React.useState<ChannelType>();
  const [nlu, setNlu] = React.useState<NLUType | undefined>();
  const [invocationName, setInvocationName] = React.useState<string>('');

  const isChannelOneClick = channel ? getChannelMeta[channel].channelSectionType === ChannelSectionType.ONE_CLICK : false;

  const handleChannelSelect = (value: ChannelType) => {
    setChannel(value);
    setNlu(undefined);
  };

  const handleNLUSelect = (value: NLUType) => {
    setNlu(value);
  };

  const handleInvocationNameChange = (value: string) => {
    setInvocationName(value);
  };

  const invocationErrorMessage =
    invocationName &&
    channel &&
    channelTypeToPlatformType[channel] &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      channelTypeToPlatformType[channel] as any,
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
          invocationDescription={channel ? getChannelMeta[channel].invocationDescription : ''}
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
