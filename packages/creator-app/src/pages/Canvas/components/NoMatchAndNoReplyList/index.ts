import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { projectTypeAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyList = projectTypeAware<NoMatchAndNoReplyListProps>({
  [VoiceflowConstants.ProjectType.CHAT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
  [VoiceflowConstants.ProjectType.VOICE]: VoiceList as React.FC<NoMatchAndNoReplyListProps>,
});

export default NoMatchAndNoReplyList;
