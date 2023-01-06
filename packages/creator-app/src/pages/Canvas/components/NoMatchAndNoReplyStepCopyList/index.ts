import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { projectTypeAware } from '@/hocs/platformAware';

import { ChatList, ChatListProps, VoiceList, VoiceListProps } from './components';

type NoMatchAndNoReplyStepCopyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyStepCopyList = projectTypeAware<NoMatchAndNoReplyStepCopyListProps>({
  [Platform.Constants.ProjectType.CHAT]: ChatList as React.OldFC<NoMatchAndNoReplyStepCopyListProps>,
  [Platform.Constants.ProjectType.VOICE]: VoiceList as React.OldFC<NoMatchAndNoReplyStepCopyListProps>,
});

export default NoMatchAndNoReplyStepCopyList;
