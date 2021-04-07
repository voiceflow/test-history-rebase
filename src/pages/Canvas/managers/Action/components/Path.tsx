import React from 'react';

import Box, { FlexCenter } from '@/components/Box';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import { Minus } from '@/components/InteractiveIcon';
import Text from '@/components/Text';
import Tooltip from '@/components/TippyTooltip';
import { styled } from '@/hocs';
import { swallowEvent } from '@/utils/dom';

type Path = { label: string; isDefault?: boolean };

type PathSectionProps = {
  index: number;
  path: Path;
  onUpdate: (path: Partial<Path>) => void;
  updateDefaultPath: (index: number) => void;
  onRemove?: () => void;
};

const Container = styled(FlexCenter)`
  :not(:last-child) {
    margin-bottom: 12px;
  }
`;

const PathSection: React.FC<PathSectionProps> = ({ path, index, onUpdate, onRemove, updateDefaultPath }) => (
  <Container>
    <Input
      leftAction={
        <Text color="#62778c" fontWeight="bold" fontSize={13}>
          PATH {index + 1}
        </Text>
      }
      value={path.label}
      onChange={(e) => onUpdate({ label: e.target.value })}
      placeholder="Add path name"
      rightAction={
        <Tooltip title={path.isDefault ? 'Default Path' : 'Assign as default path'} position="top" distance={8}>
          <Checkbox checked={path.isDefault} onClick={swallowEvent(() => updateDefaultPath(index))} padding={false} />
        </Tooltip>
      }
    />
    <Box ml={16}>
      <Tooltip title={onRemove ? 'Remove path' : 'Action step must have at least 1 path'} position="top" distance={8}>
        <Minus onClick={onRemove} disabled={!onRemove} />
      </Tooltip>
    </Box>
  </Container>
);

export default PathSection;
