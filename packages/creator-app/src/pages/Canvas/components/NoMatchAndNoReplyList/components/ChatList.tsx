import { ChatModels } from '@voiceflow/chat-types';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { MAX_SYSTEM_MESSAGES_COUNT } from '@/constants';
import TextList from '@/pages/Canvas/components/TextList';

import { NoMatchChatListItem, NoReplyChatListItem } from './ListItem';

export interface ChatListProps {
  randomize: boolean;
  reprompts?: ChatModels.Prompt[];
  isNoReply?: boolean;
  onChangeReprompts: (reprompts: ChatModels.Prompt[]) => void;
  onChangeRandomize: () => void;
  hideRandomizeMenu?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  children,
  randomize,
  reprompts = [],
  isNoReply,
  onChangeReprompts,
  onChangeRandomize,
  hideRandomizeMenu,
}) => (
  <TextList
    label="Text"
    renderMenu={
      hideRandomizeMenu
        ? null
        : () => (
            <OverflowMenu
              placement="top-end"
              options={[{ label: randomize ? `Unrandomize reprompts` : `Randomize reprompts`, onClick: onChangeRandomize }]}
            />
          )
    }
    items={reprompts}
    maxItems={MAX_SYSTEM_MESSAGES_COUNT}
    randomize={randomize}
    itemComponent={isNoReply ? NoReplyChatListItem : NoMatchChatListItem}
    onChangeItems={onChangeReprompts}
  >
    {children}
  </TextList>
);

export default ChatList;
