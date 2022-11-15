import * as Platform from '@voiceflow/platform-config';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useAutoScrollNodeIntoView } from '@/hooks';

import Prompt from './Prompt';

interface ListItemProps {
  message: Platform.Base.Models.Prompt.Model;
  onChange: (message: Partial<Platform.Base.Models.Prompt.Model>) => void;
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
