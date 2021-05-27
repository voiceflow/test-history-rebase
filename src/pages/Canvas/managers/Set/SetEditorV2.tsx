import React from 'react';

import { Flex } from '@/components/Box';
import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import Input from '@/components/Input';
import Section from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import { useFeature, useManager, useToggle } from '@/hooks';
import { NodeData } from '@/models';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Set/constants';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItemV2, HelpMessage, HelpTooltip } from './components';

const MAX_SETS = 20;

const setFactory = (conditionsBuilderEnabled?: boolean) =>
  NODE_CONFIG.factory(undefined, {
    features: {
      [FeatureFlag.CONDITIONS_BUILDER]: {
        isEnabled: !!conditionsBuilderEnabled,
      },
    },
  }).data.sets[0];

const setClone = (initVal: any, targetVal: NodeData.SetExpression) => ({
  ...initVal,
  variable: targetVal.variable,
  expression: targetVal.expression,
});

const SetEditorV2: NodeEditor<NodeData.Set> = ({ data, onChange }) => {
  const conditionsBuilder = useFeature(FeatureFlag.CONDITIONS_BUILDER);
  const [isDragging, toggleDragging] = useToggle(false);

  const updateSets = React.useCallback(
    (sets) => {
      onChange({ sets });
    },
    [onChange]
  );

  const { items, onAdd, onRemove, mapManaged, onDuplicate, onReorder, latestCreatedKey } = useManager(data.sets, updateSets, {
    factory: () => setFactory(!!conditionsBuilder.isEnabled),
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
        <Flex fullWidth zIndex={2} position="fixed" top={0} borderBottom="1px solid #eaeff4">
          <Section fullWidth>
            <Input
              icon={NODE_CONFIG.icon}
              iconProps={{ color: NODE_CONFIG.iconColor }}
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              onBlur={(e) => {
                onChange({ title: e.target.value });
              }}
              placeholder="Name Set step"
            />
          </Section>
        </Flex>
        <Flex style={{ marginTop: '84px' }}>
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
        </Flex>
      </>
    </Content>
  );
};

export default SetEditorV2;
