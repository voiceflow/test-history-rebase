import { Utils } from '@voiceflow/common';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { useMapManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { DraggableItem, HelpTooltip } from './components';

const permissionFactory = () => ({
  id: Utils.id.cuid.slug(),
  selected: null,
});

function UserInfoEditor({ data, onChange }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const updatePermissions = React.useCallback((permissions) => onChange({ permissions }), [onChange]);
  const mapManager = useMapManager(data.permissions ?? [], updatePermissions, {
    factory: permissionFactory,
  });
  const selectedPermissions = mapManager.items.map(({ selected }) => selected).filter(Boolean);

  return (
    <Content
      footer={() => (
        <Controls
          options={[{ label: 'Add Request', onClick: () => mapManager.onAdd() }]}
          anchor="How It Works"
          tutorial={{
            content: <HelpTooltip />,
            blockType: data.type,
          }}
        />
      )}
      hideFooter={isDragging}
    >
      <DraggableList
        type="user-info-editor"
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey: mapManager.latestCreatedKey, selectedPermissions, isOnlyItem: mapManager.isOnlyItem }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        partialDragItem
        deleteComponent={DeleteComponent}
        previewComponent={DraggableItem}
        withContextMenuDelete
      />
    </Content>
  );
}

export default UserInfoEditor;
