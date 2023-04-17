import { Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useAutoScrollNodeIntoView } from '@/hooks';

interface ListItemProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: VoidFunction;
  autofocus?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ value, onChange, onRemove, autofocus }) => {
  const [ref] = useAutoScrollNodeIntoView<HTMLDivElement>({ options: { block: 'end' }, condition: autofocus });

  return (
    <SectionV2.ListItem ref={ref} action={<SectionV2.RemoveButton onClick={onRemove} />}>
      <Input value={value} autoFocus={autofocus} placeholder="Enter Entity Content Example" onChangeText={onChange} />
    </SectionV2.ListItem>
  );
};

export default ListItem;
