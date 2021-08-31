import React from 'react';

import { MAX_SPEAK_ITEMS_COUNT } from '@/constants';
import { NodeData } from '@/models';
import TextList from '@/pages/Canvas/components/TextList';

import { ChatNoMatchItem } from './NoMatchItem';

interface ChatNoMatchListProps extends NodeData.ChatNoMatches {
  onChangeReprompts: (reprompts: NodeData.ChatNoMatches['reprompts']) => void;
}

const ChatNoMatchList: React.FC<ChatNoMatchListProps> = ({ reprompts, children, onChangeReprompts }) => (
  <TextList items={reprompts} maxItems={MAX_SPEAK_ITEMS_COUNT} itemComponent={ChatNoMatchItem} onChangeItems={onChangeReprompts}>
    {children}
  </TextList>
);

export default ChatNoMatchList;
