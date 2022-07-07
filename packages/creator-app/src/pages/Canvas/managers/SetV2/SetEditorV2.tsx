import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Input, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent, MapManagedEditActionHandler } from '@/components/DraggableList';
import Section from '@/components/Section';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { useSetTitleForm } from '@/pages/Canvas/managers/SetV2/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItemV2, HelpMessage, HelpTooltip } from './components';
import { MAX_SETS } from './constants';
import { setClone, setFactory } from './utils';

const SetEditorV2: NodeEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ data, onChange }) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const { inputRef: labelInputRef, stepName, setStepName } = useSetTitleForm(data.title);

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

  const addExpression = React.useCallback(
    async (scrollToBottom: (behavior?: ScrollBehavior) => void) => {
      await onAdd();
      scrollToBottom();
    },
    [onAdd]
  );

  const onDuplicateSet = usePersistFunction<MapManagedEditActionHandler<Realtime.NodeData.SetExpressionV2>>((_, item) =>
    onDuplicate(item.index, item.item)
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
              ref={labelInputRef}
              value={stepName}
              onBlur={() => onChange({ title: stepName })}
              onChangeText={setStepName}
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
