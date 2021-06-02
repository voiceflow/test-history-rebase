import React from 'react';

import PermissionSelect from '@/components/PermissionSelect';
import { SectionToggleVariant } from '@/components/Section';
import { PERMISSION_LABELS } from '@/constants';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';

import PermissionInfo from './PermissionInfo';

const DraggableItem = (
  {
    item,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    onContextMenu,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
    selectedPermissions,
  },
  ref
) => {
  const updateSelected = React.useCallback((selected) => onUpdate({ selected }), [onUpdate]);
  const isNew = latestCreatedKey === itemKey;

  return (
    <EditorSection
      ref={ref}
      namespace={['userInfoItem', item.id]}
      initialOpen={isNew || isOnlyItem}
      header={`Get ${item.selected ? PERMISSION_LABELS[item.selected] : 'Info'}`}
      collapseVariant={!isDragging && !isDraggingPreview && SectionToggleVariant.ARROW}
      isDragging={isDragging}
      headerToggle
      headerRef={connectedDragRef}
      isDraggingPreview={isDraggingPreview}
      onContextMenu={onContextMenu}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <>
          <FormControl label="User Info Type">
            <PermissionSelect value={item.selected} onChange={updateSelected} disabledOptions={selectedPermissions} />
          </FormControl>
          {item.selected && <PermissionInfo permission={item} onChange={onUpdate} />}
        </>
      )}
    </EditorSection>
  );
};

export default React.forwardRef(DraggableItem);
