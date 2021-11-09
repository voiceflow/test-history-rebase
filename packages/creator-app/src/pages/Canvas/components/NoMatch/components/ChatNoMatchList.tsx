import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import { MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import TextList from '@/pages/Canvas/components/TextList';

import { ChatNoMatchItem } from './NoMatchItem';

interface ChatNoMatchListProps extends Realtime.NodeData.ChatNoMatches {
  onChangeReprompts: (reprompts: Realtime.NodeData.ChatNoMatches['reprompts']) => void;
  onChangeRandomize: () => void;
}

const ChatNoMatchList: React.FC<ChatNoMatchListProps> = ({ onChangeRandomize, randomize, reprompts, children, onChangeReprompts }) => (
  <TextList
    label="Text"
    renderMenu={() => (
      <OverflowMenu
        placement="top-end"
        options={[{ label: randomize ? `Unrandomize reprompts` : `Randomize reprompts`, onClick: onChangeRandomize }]}
      />
    )}
    items={reprompts}
    randomize={randomize}
    maxItems={MAX_SPEAK_ITEMS_COUNT}
    itemComponent={ChatNoMatchItem}
    onChangeItems={onChangeReprompts}
  >
    {children}
  </TextList>
);

export default ChatNoMatchList;
