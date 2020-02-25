import React from 'react';

import Badge from '@/components/Badge';
import ExpressionEditor from '@/components/ExpressionEditor';
import { SectionToggleVariant } from '@/components/Section';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

const DraggableItem = (
  { itemKey, index, item, isOnlyItem, isDragging, isDraggingPreview, onUpdate, latestCreatedKey, connectedDragRef, onContextMenu, isContextMenuOpen },
  ref
) => {
  const isNew = itemKey === latestCreatedKey;

  return (
    <EditorSection
      ref={ref}
      namespace={['ifItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header="If condition"
      prefix={<Badge>{index + 1}</Badge>}
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDragging={isDragging}
      headerToggle
      headerRef={connectedDragRef}
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <FormControl>
          <ExpressionEditor expression={item} onChange={onUpdate} />
        </FormControl>
      )}
    </EditorSection>
  );
};

export default React.forwardRef(DraggableItem);
