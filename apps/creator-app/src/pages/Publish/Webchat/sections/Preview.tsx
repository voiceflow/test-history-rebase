import { Chat, ChatWidget, SystemResponse, UserResponse } from '@voiceflow/react-chat';
import React from 'react';

import * as Version from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

const SYSTEM_MESSAGES = [
  { type: 'text', text: 'Hi there, this is a sample message for your assistant.' },
  { type: 'text', text: 'How can I help you today?' },
];

const ACTIONS = [
  { name: 'Get Started', request: null },
  { name: 'Book a Demo', request: null },
  { name: 'Read Documentation', request: null },
];

export const PreviewSection: React.FC = () => {
  const startTime = React.useMemo(() => Date.now(), []);

  const config = useSelector(Version.active.voiceflow.chat.publishingSelector);

  return (
    <ChatWidget.ChatContainer>
      <Chat {...config} isLoading={false}>
        <SystemResponse messages={SYSTEM_MESSAGES} avatar={config.avatar} timestamp={startTime} isLast actions={ACTIONS} />
        {/* normally a user response would never appear after buttons */}
        <UserResponse message="Sample reply" timestamp={startTime} />
      </Chat>
    </ChatWidget.ChatContainer>
  );
};
