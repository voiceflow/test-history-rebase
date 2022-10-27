import { Chat, ChatWidget, SystemResponse, UserResponse } from '@voiceflow/react-chat';
import React from 'react';

import * as Version from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

const SYSTEM_MESSAGES = [
  { type: 'text', text: "Hi there, I'm Enigma the Turing teams virtual assistant ⚡️" },
  { type: 'text', text: 'How can I help you today?' },
];

const ACTIONS = [{ label: 'Get Started' }, { label: 'Book a Demo' }, { label: 'Read Documentation' }];

export const PreviewSection: React.FC = () => {
  const startTime = React.useMemo(() => new Date(), []);

  const config = useSelector(Version.active.general.chatPublishingSelector);

  return (
    <ChatWidget.ChatContainer>
      <Chat {...config} isLoading={false}>
        <SystemResponse messages={SYSTEM_MESSAGES} avatar={config.avatar} timestamp={startTime} isLast actions={ACTIONS} />
        {/* normally a user response would never appear after buttons */}
        <UserResponse message="Sample Response" timestamp={startTime} />
      </Chat>
    </ChatWidget.ChatContainer>
  );
};
