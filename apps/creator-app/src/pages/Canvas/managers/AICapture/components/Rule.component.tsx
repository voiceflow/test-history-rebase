import { Box, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import { useLinkedState } from '@/hooks';

interface PathSectionProps {
  value: string;
  isLast: boolean;
  onUpdate: (value: string) => void;
  onRemove?: VoidFunction;
  placeholder?: string;
}

const RuleSection: React.FC<PathSectionProps> = ({ value, onUpdate, onRemove, isLast, placeholder }) => {
  const [text, setText] = useLinkedState(value);
  return (
    <Box pb={isLast ? 16 : 12}>
      <SectionV2.ListItem action={<SectionV2.RemoveButton onClick={onRemove} />}>
        <Input value={text} placeholder={placeholder} onBlur={() => onUpdate(text)} onChangeText={setText} />
      </SectionV2.ListItem>
    </Box>
  );
};

export default RuleSection;
