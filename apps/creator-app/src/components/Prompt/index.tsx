import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import SystemMessage from '@/components/SystemMessage';
import type { ChatMessageProps, ChatMessageRef } from '@/components/SystemMessage/types';
import { useActiveProjectType } from '@/hooks';

import { VoicePrompt } from './components';
import type { PromptProps, PromptRef, VoicePromptProps, VoicePromptRef } from './types';

const Prompt = React.forwardRef<PromptRef, PromptProps>((props, ref) => {
  const projectType = useActiveProjectType();

  switch (projectType) {
    case Platform.Constants.ProjectType.CHAT:
      return <SystemMessage.Chat ref={ref as React.Ref<ChatMessageRef>} {...(props as ChatMessageProps)} />;
    case Platform.Constants.ProjectType.VOICE:
      return <VoicePrompt ref={ref as React.Ref<VoicePromptRef>} {...(props as VoicePromptProps)} />;
    default:
      return null;
  }
});

export default Object.assign(Prompt, {
  Chat: SystemMessage.Chat,
  Voice: VoicePrompt,
});
