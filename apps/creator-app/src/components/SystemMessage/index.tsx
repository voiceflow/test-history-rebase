import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { useActiveProjectType } from '@/hooks';

import { ChatMessage, VoiceMessage } from './components';
import type { ChatMessageProps, ChatMessageRef, SystemMessageProps, VoiceMessageProps, VoiceMessageRef } from './types';

const SystemMessage = React.forwardRef<HTMLDivElement, SystemMessageProps>((props, ref) => {
  const projectType = useActiveProjectType();

  switch (projectType) {
    case Platform.Constants.ProjectType.CHAT:
      return <ChatMessage ref={ref as React.Ref<ChatMessageRef>} {...(props as ChatMessageProps)} />;
    case Platform.Constants.ProjectType.VOICE:
      return <VoiceMessage ref={ref as React.Ref<VoiceMessageRef>} {...(props as VoiceMessageProps)} />;
    default:
      return null;
  }
});

export default Object.assign(SystemMessage, {
  Chat: ChatMessage,
  Voice: VoiceMessage,
});
