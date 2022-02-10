import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { platformAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyStepCopyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyStepCopyList = platformAware<NoMatchAndNoReplyStepCopyListProps>(
  {
    [VoiceflowConstants.PlatformType.CHATBOT]: ChatList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
    [VoiceflowConstants.PlatformType.DIALOGFLOW_ES_CHAT]: ChatList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
  },
  VoiceList as React.FC<NoMatchAndNoReplyStepCopyListProps>
);

export default NoMatchAndNoReplyStepCopyList;
