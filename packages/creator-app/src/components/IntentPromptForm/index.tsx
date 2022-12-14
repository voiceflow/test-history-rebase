import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useActiveProjectType } from '@/hooks';

import { ChatForm, VoiceForm } from './components';
import { ChatIntentPromptFormProps, IntentPromptFormProps, VoiceIntentPromptFormProps } from './types';

const IntentPromptForm: React.FC<IntentPromptFormProps> = ({ prompt, ...props }) => {
  const projectType = useActiveProjectType();

  return Realtime.Utils.typeGuards.isChatProjectType(projectType) ? (
    <ChatForm prompt={prompt as ChatIntentPromptFormProps['prompt']} {...props} />
  ) : (
    <VoiceForm prompt={prompt as VoiceIntentPromptFormProps['prompt']} {...props} />
  );
};

export default Object.assign(IntentPromptForm, {
  ChatForm,
  VoiceForm,
});
