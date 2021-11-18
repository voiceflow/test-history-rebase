import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Input } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import Section from '@/components/Section';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItemV2, HelpMessage, HelpTooltip } from './components';
import { NODE_CONFIG } from './constants';

const MAX_SETS = 20;

const setFactory = () => NODE_CONFIG.factory(undefined).data.sets[0];

const setClone = (initVal: Realtime.NodeData.SetExpressionV2, targetVal: Realtime.NodeData.SetExpressionV2) => ({
  ...initVal,
  variable: targetVal.variable,
  expression: targetVal.expression,
});

const SetEditorV2: NodeEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ data, onChange }) => {
  const [isDragging, toggleDragging] = useToggle(false);

  const updateSets = React.useCallback(
    (sets) => {
      onChange({ sets });
    },
    [onChange]
  );

  const { items, onAdd, onRemove, mapManaged, onDuplicate, onReorder, latestCreatedKey } = useManager(data.sets, updateSets, {
    factory: () => setFactory(),
    clone: setClone,
  });

  const [stepName, setStepName] = React.useState(data.title);

  const addExpression = React.useCallback(
    async (scrollToBottom: (behavior?: ScrollBehavior) => void) => {
      await onAdd();
      scrollToBottom();
    },
    [onAdd]
  );

  const onDuplicateSet = React.useCallback(
    (_, item) => {
      onDuplicate(item.index, item);
    },
    [onDuplicate]
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
      <>
        <BoxFlex fullWidth zIndex={2} position="fixed" top={0} borderBottom="1px solid #eaeff4">
          <Section fullWidth>
            <Input
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              onBlur={(e) => {
                onChange({ title: e.target.value });
              }}
              placeholder="Set Label"
            />
          </Section>
        </BoxFlex>
        <BoxFlex style={{ marginTop: '84px' }}>
          <DraggableList
            type="set-editor"
            onDelete={onRemove}
            onReorder={onReorder}
            onDuplicate={onDuplicateSet}
            onEndDrag={toggleDragging}
            itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
            mapManaged={mapManaged}
            onStartDrag={toggleDragging}
            itemComponent={DraggableItemV2}
            deleteComponent={DeleteComponent}
            partialDragItem
            previewComponent={DraggableItemV2}
            withContextMenuDelete
            withContextMenuDuplicate
          />
        </BoxFlex>
      </>
    </Content>
  );
};

export default SetEditorV2;
