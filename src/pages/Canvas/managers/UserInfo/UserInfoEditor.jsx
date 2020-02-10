import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/componentsV2/DraggableList';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor/components';

import { DraggableItem, HelpMessage, HelpTooltip } from './components';

const permissionFactory = () => ({
  id: cuid.slug(),
  selected: null,
});

function UserInfoEditor({ data, onChange }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const updatePermissions = React.useCallback((permissions) => onChange({ permissions }), [onChange]);
  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(data.permissions, updatePermissions, {
    factory: permissionFactory,
  });
  const selectedPermissions = items.map(({ selected }) => selected).filter(Boolean);

  return (
    <Content
      footer={() => (
        <Controls
          options={[
            {
              label: 'Add Request',
              onClick: onAdd,
            },
          ]}
          anchor="How It Works"
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
            helpMessage: <HelpMessage />,
          }}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="speak-editor"
        items={items}
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, selectedPermissions, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={DraggableItem}
      />
    </Content>
  );
}

export default UserInfoEditor;
