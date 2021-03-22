import React from 'react';

import Badge from '@/components/Badge';
import Box, { Flex } from '@/components/Box';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import Tooltip from '@/components/TippyTooltip';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { convertToWord } from '@/utils/number';

type DraggableItemProps = {
  index: number;
  item: { id: string; label: string; isDefault?: boolean };
  isDragging?: boolean;
  onContextMenu?: React.MouseEventHandler;
  connectedDragRef: React.Ref<HTMLDivElement>;
  onUpdate: (item: any) => void;
  defaultPath?: number;
  updateDefaultPath: (index: number) => void;
  isContextMenuOpen?: boolean;
  isDraggingPreview?: boolean;
};

const DraggableItem: React.ForwardRefRenderFunction<HTMLDivElement, DraggableItemProps> = (
  { index, item, isDragging, onUpdate, connectedDragRef, onContextMenu, isContextMenuOpen, updateDefaultPath, isDraggingPreview },
  ref
) => (
  <EditorSection
    ref={ref}
    namespace={['traceItem', item.id]}
    prefix={<Badge>{index + 1}</Badge>}
    header={<span style={{ textTransform: 'capitalize' }}>Path {convertToWord(index + 1)}</span>}
    isDragging={isDragging}
    isDraggingPreview={isDraggingPreview}
    headerToggle
    headerRef={connectedDragRef}
    onContextMenu={onContextMenu}
    isContextMenuOpen={isContextMenuOpen}
    suffix={
      <Flex>
        {item.isDefault && <Box mr={8}>Default</Box>}
        <Tooltip title={item.isDefault ? 'Default Path' : 'Assign as default path'} position="bottom">
          <Checkbox checked={item.isDefault} onChange={() => updateDefaultPath(index)} />
        </Tooltip>
      </Flex>
    }
  >
    {!isDragging && (
      <FormControl>
        <Input value={item.label} onChange={(e) => onUpdate({ label: e.target.value })} placeholder={`Path ${index + 1} Name`} />
      </FormControl>
    )}
  </EditorSection>
);

export default React.forwardRef(DraggableItem);
