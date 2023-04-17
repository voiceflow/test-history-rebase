import * as Platform from '@voiceflow/platform-config';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import Prompt from '@/components/Prompt';
import { PromptRef } from '@/components/Prompt/types';
import { useAutoScrollNodeIntoView } from '@/hooks';

interface ListItemProps {
  message: Platform.Base.Models.Prompt.Model;
  onEmpty?: (isEmpty: boolean) => void;
  onChange: (message: Partial<Platform.Base.Models.Prompt.Model>) => void;
  onRemove?: VoidFunction;
  readOnly?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

const ListItem = React.forwardRef<PromptRef, ListItemProps>(({ onRemove, ...props }, ref) => {
  const [scrollRef] = useAutoScrollNodeIntoView<HTMLDivElement>({ options: { block: 'end' }, condition: props.autoFocus });

  return (
    <SectionV2.ListItem ref={scrollRef} action={<SectionV2.RemoveButton onClick={onRemove} disabled={!onRemove} />}>
      <Prompt ref={ref} {...props} />
    </SectionV2.ListItem>
  );
});

export default ListItem;
