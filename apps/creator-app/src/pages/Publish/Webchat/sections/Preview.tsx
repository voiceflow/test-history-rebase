import { BaseRequest } from '@voiceflow/base-types';
import { Chat, ChatWidget, SystemResponse, UserResponse } from '@voiceflow/react-chat';
import React from 'react';

import * as Version from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

const SYSTEM_MESSAGES = [
  { type: 'text', text: 'Hi there, this is a sample message for your assistant.' },
  { type: 'text', text: 'How can I help you today?' },
] as React.ComponentProps<typeof SystemResponse>['messages'];

const DEFAULT_REQUEST: BaseRequest.TextRequest = {
  type: BaseRequest.RequestType.TEXT,
  payload: 'test',
};

const ACTIONS = [
  { name: 'Get Started', request: DEFAULT_REQUEST },
  { name: 'Book a Demo', request: DEFAULT_REQUEST },
  { name: 'Read Documentation', request: DEFAULT_REQUEST },
];

export const PreviewSection: React.FC = () => {
  const startTime = React.useMemo(() => Date.now(), []);

  const config = useSelector(Version.active.voiceflow.chat.publishingSelector);

  return (
    <ChatWidget.ChatContainer>
      <Chat {...config} isLoading={false} withWatermark>
        <SystemResponse messages={SYSTEM_MESSAGES} avatar={config.avatar} timestamp={startTime} isLast actions={ACTIONS} />
        {/* normally a user response would never appear after buttons */}
        <UserResponse message="Sample reply" timestamp={startTime} />
      </Chat>
    </ChatWidget.ChatContainer>
  );
};
