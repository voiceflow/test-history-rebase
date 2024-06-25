import type * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { prettifyBucketURL } from '@/utils/audio';

import Item from './Item';
import ListContainer from './ListContainer';

export interface VoiceListProps {
  prefix: string;
  onClick?: VoidFunction;
  reprompts: Platform.Common.Voice.Models.Prompt.Model[];
}

const VoiceList: React.FC<VoiceListProps> = ({ prefix, onClick, reprompts }) => (
  <ListContainer>
    {reprompts.map((prompt, index) => {
      const content = prompt.audio ? prettifyBucketURL(prompt.audio) : prompt.content;

      return content ? (
        <Item
          key={prompt.id}
          label={`${prefix} ${index + 1}`}
          onClick={onClick}
          isLast={index === reprompts.length - 1}
        >
          {content}
        </Item>
      ) : null;
    })}
  </ListContainer>
);

export default VoiceList;
