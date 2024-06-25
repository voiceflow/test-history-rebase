import type * as Platform from '@voiceflow/platform-config';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import React from 'react';

import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

import Item from './Item';
import ListContainer from './ListContainer';

export interface ChatListProps {
  prefix: string;
  onClick?: VoidFunction;
  reprompts: Platform.Common.Chat.Models.Prompt.Model[];
}

const ChatList: React.FC<ChatListProps> = ({ prefix, onClick, reprompts }) => {
  const entitiesAndVariables = useSelector(Diagram.active.allSlotsAndVariablesNormalizedSelector);

  return (
    <ListContainer>
      {reprompts.map((prompt, index) => (
        <Item
          key={prompt.id}
          label={`${prefix} ${index + 1}`}
          onClick={onClick}
          isLast={index === reprompts.length - 1}
        >
          {serializeToText(prompt.content, { variablesMap: entitiesAndVariables.byKey })}
        </Item>
      ))}
    </ListContainer>
  );
};

export default ChatList;
