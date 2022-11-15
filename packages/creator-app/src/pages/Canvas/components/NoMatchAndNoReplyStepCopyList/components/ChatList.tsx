import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';

import Item from './Item';
import ListContainer from './ListContainer';

export interface ChatListProps {
  prefix: string;
  onClick?: VoidFunction;
  reprompts: Platform.Common.Chat.Models.Prompt.Model[];
}

const ChatList: React.FC<ChatListProps> = ({ prefix, onClick, reprompts }) => (
  <ListContainer>
    {reprompts.map((prompt, index) => (
      <Item key={prompt.id} label={`${prefix} ${index + 1}`} onClick={onClick} isLast={index === reprompts.length - 1}>
        {SlateEditorAPI.serialize(prompt.content)}
      </Item>
    ))}
  </ListContainer>
);

export default ChatList;
