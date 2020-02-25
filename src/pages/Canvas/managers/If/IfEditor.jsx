import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { ExpressionType } from '@/constants';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor/components';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';

import { DraggableItem, HelpTooltip } from './components';

const expressionFactory = () => ({
  id: cuid.slug(),
  type: ExpressionType.EQUALS,
  depth: 0,
  value: [
    {
      depth: 1,
      type: ExpressionType.VARIABLE,
      value: null,
    },
    {
      depth: 1,
      type: ExpressionType.VALUE,
      value: '',
    },
  ],
});

function IfEditor({ data, onChange, focusedNode }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const engine = React.useContext(EngineContext);
  const updateExpressions = React.useCallback((expressions, save) => onChange({ expressions }, save), [onChange]);
  const onRemoveExpression = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [
    engine.port,
    focusedNode.ports.out,
  ]);

  const { items, onAdd, onRemove, mapManaged, onReorder, latestCreatedKey } = useManager(data.expressions, updateExpressions, {
    factory: expressionFactory,
    autosave: false,
    handleRemove: onRemoveExpression,
  });

  const addExpression = React.useCallback(
    async (scrollToBottom) => {
      onAdd();

      await engine.port.add(focusedNode.id, { label: items.length + 1 });

      scrollToBottom();
    },
    [engine.port, focusedNode.id, items.length, onAdd]
  );

  const reorderExpression = React.useCallback(
    (from, to) => {
      onReorder(from, to);

      engine.port.reorder(focusedNode.id, from + 1, to + 1);
    },
    [onReorder, engine.port, focusedNode.id]
  );

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            options={[
              {
                label: 'Add If Statement',
                onClick: () => addExpression(scrollToBottom),
              },
            ]}
            tutorial={{
              content: <HelpTooltip />,
              blockType: data.type,
              helpTitle: 'Having trouble?',
              helpMessage: (
                <>
                  Check out this{' '}
                  <a href="https://docs.voiceflow.com/voiceflow-documentation/untitled/if-block" target="_blank" rel="noopener noreferrer">
                    doc
                  </a>{' '}
                  that goes over using IF blocks inside Voiceflow.
                </>
              ),
            }}
          />
        ) : (
          <MaxOptionsMessage>Maximum options reached</MaxOptionsMessage>
        )
      }
      hideFooter={isDragging}
    >
      <DraggableList
        type="if-editor"
        items={items}
        onDelete={onRemove}
        onReorder={reorderExpression}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
      />
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(IfEditor);
