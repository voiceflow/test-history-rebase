import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { MapManaged, useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { ConditionsSection, HelpTooltip, NoMatchSection } from './components';
import { NODE_CONFIG } from './constants';

const setClone = (initVal: Realtime.ExpressionData, targetVal: Realtime.ExpressionData) => ({
  ...initVal,
  name: targetVal.name,
  value: targetVal.value,
});

const expressionFactory = () => NODE_CONFIG.factory(undefined).data.expressions[0];

const IfEditor: NodeEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ data, node, engine, pushToPath, onChange }) => {
  const [isDragging, toggleDragging] = useToggle(false);

  const updateExpressions = React.useCallback((expressions, save) => onChange({ expressions }, save), [onChange]);
  const onRemoveExpression = React.useCallback(
    (_, index) => engine.port.removeOutDynamic(node.ports.out.dynamic[index]),
    [engine, node.ports.out.dynamic]
  );

  const { items, onAdd, onRemove, onDuplicate, mapManaged, onReorder, latestCreatedKey } = useManager(data.expressions, updateExpressions, {
    clone: setClone,
    factory: () => expressionFactory(),
    autosave: false,
    handleRemove: onRemoveExpression,
  });

  const reorderExpressions = React.useCallback(
    (from: number, to: number) => {
      onReorder(from, to);

      engine.port.reorderOutDynamic(node.id, from, to);
    },
    [onReorder, engine, node.id]
  );

  const addExpression = React.useCallback(
    async (scrollToBottom: (behavior?: ScrollBehavior) => void) => {
      onAdd();

      await engine.port.addOutDynamic(node.id);

      scrollToBottom();
    },
    [engine, onAdd, node.id]
  );

  const onDuplicationExp = React.useCallback(
    async (_, item) => {
      onDuplicate(item.index, item);

      await engine.port.addOutDynamic(node.id);
    },
    [onDuplicate, node.id]
  );

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            options={[
              {
                label: 'Add Condition',
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
                  <a href="https://docs.voiceflow.com/#/steps/condition" target="_blank" rel="noopener noreferrer">
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
        onDelete={onRemove}
        onDuplicate={onDuplicationExp}
        onReorder={reorderExpressions}
        onEndDrag={toggleDragging}
        footer={<NoMatchSection noMatch={data.noMatch} pushToPath={pushToPath} />}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged as MapManaged<Realtime.ExpressionData>}
        onStartDrag={toggleDragging}
        itemComponent={ConditionsSection}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={ConditionsSection}
        withContextMenuDelete
        withContextMenuDuplicate
      />
    </Content>
  );
};

export default IfEditor;
