import { Types } from '@voiceflow/chat-types';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import TextList from '@/pages/Canvas/components/TextList';

import { ChatListItem } from './ListItem';

export interface ChatListProps {
  randomize: boolean;
  reprompts?: Types.Prompt[];
  onChangeReprompts: (reprompts: Types.Prompt[]) => void;
  onChangeRandomize: () => void;
  hideRandomizeMenu?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ children, randomize, reprompts = [], onChangeReprompts, onChangeRandomize, hideRandomizeMenu }) => (
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
    maxItems={MAX_SPEAK_ITEMS_COUNT}
    randomize={randomize}
    itemComponent={ChatListItem}
    onChangeItems={onChangeReprompts}
  >
    {children}
  </TextList>
);

export default ChatList;
