import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import { DraggableItem, HelpMessage, HelpTooltip } from './components';
import { NODE_CONFIG } from './constants';

const MAX_SETS = 20;

const setClone = (initVal, targetVal) => ({
  ...initVal,
  variable: targetVal.variable,
  expression: {
    ...targetVal.expression,
    id: initVal.expression.id,
  },
});

const setFactory = () => NODE_CONFIG.factory().data.sets[0];

function SetEditor({ data, onChange }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const updateSets = React.useCallback((sets) => onChange({ sets }), [onChange]);
  const onRemoveSets = React.useCallback((_, index) => onChange(data.sets.splice(index, 1)), [data.sets, onChange]);
  const { items, onAdd, onRemove, onDuplicate, mapManaged, onReorder, latestCreatedKey } = useManager(data.sets, updateSets, {
    clone: setClone,
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

  const duplicateSet = React.useCallback((_, item) => onDuplicate(item.index, item), [onDuplicate]);

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
        onDuplicate={duplicateSet}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
        withContextMenuDuplicate
      />
    </Content>
  );
}

export default SetEditor;
