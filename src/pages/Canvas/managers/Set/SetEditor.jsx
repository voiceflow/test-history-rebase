import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { DraggableItem, HelpMessage, HelpTooltip } from './components';

const MAX_SETS = 20;

const setFactory = () => ({
  id: cuid.slug(),
  expression: {
    type: 'value',
    value: '',
    depth: 0,
  },
});

function SetEditor({ data, onChange }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const updateSets = React.useCallback((sets) => onChange({ sets }), [onChange]);
  const onRemoveSets = React.useCallback((_, index) => onChange(data.sets.splice(index, 1)), [data.sets, onChange]);
  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(data.sets, updateSets, {
    factory: setFactory,
    handleRemove: onRemoveSets,
  });

  const addExpression = React.useCallback(
    async (scrollToBottom) => {
      await onAdd();
      scrollToBottom();
    },
    [onAdd]
  );

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_SETS ? (
          <Controls
            options={[
              {
                label: 'Add Set',
                onClick: () => addExpression(scrollToBottom),
              },
            ]}
            tutorial={{ blockType: data.type, content: <HelpTooltip />, helpTitle: 'Still having trouble?', helpMessage: <HelpMessage /> }}
          />
        ) : (
          <div>Maximum options reached</div>
        )
      }
      hideFooter={isDragging}
    >
      <DraggableList
        type="set-editor"
        items={items}
        onDelete={onRemove}
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
      />
    </Content>
  );
}

export default SetEditor;
