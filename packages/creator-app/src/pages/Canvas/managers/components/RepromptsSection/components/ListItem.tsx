import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useAutoScrollNodeIntoView } from '@/hooks';

import Prompt from './Prompt';

interface ListItemProps {
  message: ChatModels.Prompt | Realtime.NodeData.VoicePrompt;
  onChange: (message: Partial<ChatModels.Prompt | Realtime.NodeData.VoicePrompt>) => void;
  onRemove: VoidFunction;
  autoFocus?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ onRemove, ...props }) => {
  const [ref] = useAutoScrollNodeIntoView<HTMLDivElement>({ options: { block: 'end' }, condition: props.autoFocus });

  return (
    <SectionV2.ListItem ref={ref} action={<SectionV2.RemoveButton onClick={onRemove} />}>
      <Prompt {...props} />
    </SectionV2.ListItem>
  );
};

export default ListItem;
