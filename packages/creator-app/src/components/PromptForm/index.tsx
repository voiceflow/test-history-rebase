import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ProjectTypeContext } from '@/pages/Project/contexts';

import { ChatForm, VoiceForm } from './components';
import { ChatPromptFormProps, PromptFormProps, VoicePromptFormProps } from './types';

const PromptForm: React.FC<PromptFormProps> = ({ prompt, ...props }) => {
  const projectType = React.useContext(ProjectTypeContext)!;

  return Realtime.Utils.typeGuards.isChatProjectType(projectType) ? (
    <ChatForm prompt={prompt as ChatPromptFormProps['prompt']} {...props} />
  ) : (
    <VoiceForm prompt={prompt as VoicePromptFormProps['prompt']} {...props} />
  );
};

export default Object.assign(PromptForm, {
  ChatForm,
  VoiceForm,
});
