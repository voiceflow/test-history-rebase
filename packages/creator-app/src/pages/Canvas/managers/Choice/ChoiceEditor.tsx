import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import OverflowMenu from '@/components/OverflowMenu';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { useButtonsOptionSection, useIntentScope, useNoMatchOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItem } from './components';
import { MAX_CHOICE_ITEMS, NODE_CONFIG } from './constants';

const choiceFactory = () => NODE_CONFIG.factory().data.choices[0];

const ChoiceEditor: NodeEditor<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  data,
  node,
  engine,
  platform,
  onChange,
  pushToPath,
}) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const { choices } = data;

  const updateChoices = React.useCallback(
    (choices: Record<Realtime.DistinctPlatform, Realtime.NodeData.InteractionChoice>[], save?: boolean) => onChange({ choices }, save),
    [onChange]
  );

  const onRemoveChoice = React.useCallback(
    (_: any, index: number) => engine.port.removeDynamic(node.ports.out.dynamic[index]),
    [engine, node.ports.out.dynamic]
  );

  const { onAdd, mapManaged, onRemove, onReorder, latestCreatedKey } = useManager(choices, updateChoices, {
    factory: choiceFactory,
    autosave: false,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(
    async (scrollToBottom: VoidFunction) => {
      onAdd();

      await engine.port.addDynamic(node.id);

      scrollToBottom();
    },
    [onAdd, engine, node.id]
  );

  const reorderChoice = React.useCallback(
    async (from: number, to: number) => {
      onReorder(from, to);

      await engine.port.reorderDynamic(node.id, from, to);
    },
    [onReorder, engine, node]
  );

  const intentScopeOption = useIntentScope({ data, onChange });
  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [noMatchOption, noMatchSection] = useNoMatchOptionSection({ data, onChange, pushToPath });
  const [buttonsOption, buttonsSection] = useButtonsOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={({ scrollToBottom }) =>
        choices.length < MAX_CHOICE_ITEMS ? (
          <Controls
            menu={<OverflowMenu placement="top-end" options={[noMatchOption, noReplyOption, buttonsOption, intentScopeOption]} />}
            options={[
              {
                icon: NODE_CONFIG.icon,
                label: 'Add Path',
                onClick: () => addChoice(scrollToBottom),
              },
            ]}
            tutorial={{
              content: <HelpTooltip />,
              blockType: data.type,
            }}
          />
        ) : (
          <MaxOptionsMessage>Maximum options reached</MaxOptionsMessage>
        )
      }
      hideFooter={isDragging}
    >
      <DraggableList
        type="interaction-editor"
        footer={
          <>
            {buttonsSection}
            {noMatchSection}
            {noReplySection}
          </>
        }
        onDelete={onRemove}
        onReorder={reorderChoice}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, pushToPath, isOnlyItem: choices.length === 1, platform, choices }}
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
};

export default ChoiceEditor;
