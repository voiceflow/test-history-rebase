import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { platformAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyStepCopyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyStepCopyList = platformAware<NoMatchAndNoReplyStepCopyListProps>(
  {
    [Constants.PlatformType.CHATBOT]: ChatList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
  },
  VoiceList as React.FC<NoMatchAndNoReplyStepCopyListProps>
);

export default NoMatchAndNoReplyStepCopyList;
