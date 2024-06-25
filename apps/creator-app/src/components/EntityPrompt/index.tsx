import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useActiveProjectType } from '@/hooks';

import { ChatForm, VoiceForm } from './components';
import type { ChatEntityPromptProps, EntityPromptProps, VoiceEntityPromptProps } from './types';

const EntityPrompt: React.FC<EntityPromptProps> = ({
  prompt,
  placeholder = 'Enter question to prompt user to fill entity',
  ...props
}) => {
  const projectType = useActiveProjectType();

  return Realtime.Utils.typeGuards.isChatProjectType(projectType) ? (
    <ChatForm prompt={prompt as ChatEntityPromptProps['prompt']} placeholder={placeholder} {...props} />
  ) : (
    <VoiceForm prompt={prompt as VoiceEntityPromptProps['prompt']} placeholder={placeholder} {...props} />
  );
};

export default Object.assign(EntityPrompt, {
  ChatForm,
  VoiceForm,
});
