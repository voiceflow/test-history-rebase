import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { projectTypeAware } from '@/hocs/platformAware';

import { ChatList, VoiceList } from './components';

interface NoMatchAndNoReplyListProps {
  randomize: boolean;
  children?: React.ReactNode;
  reprompts?: Platform.Base.Models.Prompt.Model[];
  isNoReply?: boolean;
  onChangeReprompts: (reprompts: Platform.Base.Models.Prompt.Model[]) => void;
  onChangeRandomize: () => void;
  hideRandomizeMenu?: boolean;
}

const NoMatchAndNoReplyList = projectTypeAware<NoMatchAndNoReplyListProps>({
  [Platform.Constants.ProjectType.CHAT]: ChatList as React.FC<NoMatchAndNoReplyListProps>,
  [Platform.Constants.ProjectType.VOICE]: VoiceList as React.FC<NoMatchAndNoReplyListProps>,
});

export default NoMatchAndNoReplyList;
