import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { platformAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyList = platformAware<NoMatchAndNoReplyListProps>(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
  },
  VoiceList as React.FC<NoMatchAndNoReplyListProps>
);

export default NoMatchAndNoReplyList;
