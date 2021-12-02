import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Item from './Item';
import ListContainer from './ListContainer';

export interface VoiceListProps {
  prefix: string;
  onClick?: VoidFunction;
  reprompts: Realtime.NodeData.VoicePrompt[];
}

const VoiceList: React.FC<VoiceListProps> = ({ prefix, onClick, reprompts }) => (
  <ListContainer>
    {reprompts.map((prompt, index) => (
      <Item key={prompt.id} label={`${prefix} ${index + 1}`} onClick={onClick} isLast={index === reprompts.length - 1}>
        {prompt.content}
      </Item>
    ))}
  </ListContainer>
);

export default VoiceList;
