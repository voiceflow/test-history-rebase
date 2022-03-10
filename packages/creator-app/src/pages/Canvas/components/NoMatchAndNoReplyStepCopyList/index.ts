import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { projectTypeAware } from '@/hocs';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyStepCopyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyStepCopyList = projectTypeAware<NoMatchAndNoReplyStepCopyListProps>({
  [VoiceflowConstants.ProjectType.CHAT]: ChatList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
  [VoiceflowConstants.ProjectType.VOICE]: VoiceList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
});

export default NoMatchAndNoReplyStepCopyList;
