import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { platformAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyList = platformAware<NoMatchAndNoReplyListProps>(
  {
    [Constants.PlatformType.CHATBOT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
  },
  VoiceList as React.FC<NoMatchAndNoReplyListProps>
);

export default NoMatchAndNoReplyList;
