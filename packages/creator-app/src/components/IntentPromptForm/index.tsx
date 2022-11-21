import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ProjectTypeContext } from '@/pages/Project/contexts';

import { ChatForm, VoiceForm } from './components';
import { ChatIntentPromptFormProps, IntentPromptFormProps, VoiceIntentPromptFormProps } from './types';

const IntentPromptForm: React.FC<IntentPromptFormProps> = ({ prompt, ...props }) => {
  const projectType = React.useContext(ProjectTypeContext)!;

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
