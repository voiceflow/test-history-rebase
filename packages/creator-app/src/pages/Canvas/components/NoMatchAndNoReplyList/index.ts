import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { projectTypeAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyList = projectTypeAware<NoMatchAndNoReplyListProps>({
  [Platform.Constants.ProjectType.CHAT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
  [Platform.Constants.ProjectType.VOICE]: VoiceList as React.FC<NoMatchAndNoReplyListProps>,
});

export default NoMatchAndNoReplyList;
