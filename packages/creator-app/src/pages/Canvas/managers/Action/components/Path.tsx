import { Box, BoxFlexCenter, Checkbox, Input, swallowEvent, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { Minus } from '@/components/InteractiveIcon';
import { styled } from '@/hocs/styled';
import { useLinkedState } from '@/hooks';

interface Path {
  label: string;
  isDefault?: boolean;
}

interface PathSectionProps {
  path: Path;
  index: number;
  onUpdate: (path: Partial<Path>) => void;
  onRemove?: VoidFunction;
  updateDefaultPath: (index: number) => void;
}

const Container = styled(BoxFlexCenter)`
  :not(:last-child) {
    margin-bottom: 12px;
  }
`;

const PathSection: React.FC<PathSectionProps> = ({ path, index, onUpdate, onRemove, updateDefaultPath }) => {
  const [label, setLabel] = useLinkedState(path.label);
  return (
    <Container>
      <Input
        leftAction={
          <Text color="#62778c" fontWeight="600" fontSize={13}>
            PATH {index + 1}
          </Text>
        }
        value={label}
        placeholder="Add path name"
        rightAction={
          <TippyTooltip title={path.isDefault ? 'Default Path' : 'Assign as default path'} position="top" distance={8}>
            <Checkbox checked={path.isDefault} onChange={swallowEvent(() => updateDefaultPath(index))} padding={false} />
          </TippyTooltip>
        }
        onBlur={() => onUpdate({ label })}
        onChangeText={setLabel}
      />
      <Box ml={16}>
        <TippyTooltip title={onRemove ? 'Remove path' : 'Action step must have at least 1 path'} position="top" distance={8}>
          <Minus onClick={onRemove} disabled={!onRemove} />
        </TippyTooltip>
      </Box>
    </Container>
  );
};

export default PathSection;
