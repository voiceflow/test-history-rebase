import * as Platform from '@voiceflow/platform-config';
import type React from 'react';

import { projectTypeAware } from '@/hocs/platformAware';

import type { ChatListProps, VoiceListProps } from './components';
import { ChatList, VoiceList } from './components';

type NoMatchAndNoReplyStepCopyListProps = ChatListProps | VoiceListProps;

const NoMatchAndNoReplyStepCopyList = projectTypeAware<NoMatchAndNoReplyStepCopyListProps>({
  [Platform.Constants.ProjectType.CHAT]: ChatList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
  [Platform.Constants.ProjectType.VOICE]: VoiceList as React.FC<NoMatchAndNoReplyStepCopyListProps>,
});

export default NoMatchAndNoReplyStepCopyList;
