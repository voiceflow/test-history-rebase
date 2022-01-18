import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import OverflowMenu from '@/components/OverflowMenu';
import * as IntentV2 from '@/ducks/intentV2';
import { useManager, useSelector, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { useButtonsOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItem } from './components';
import { NODE_CONFIG } from './constants';

const choiceFactory = () => NODE_CONFIG.factory().data.choices[0];

const ChoiceEditor: NodeEditor<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  data,
  node,
  engine,
  platform,
  onChange,
  pushToPath,
}) => {
  const openIntents = useSelector(IntentV2.openIntentsSelector);

  const [isDragging, toggleDragging] = useToggle(false);
  const { choices } = data;

  const updateChoices = React.useCallback(
    (choices: Record<Realtime.DistinctPlatform, Realtime.NodeData.InteractionChoice>[], save?: boolean) => onChange({ choices }, save),
    [onChange]
  );

  const onRemoveChoice = React.useCallback(
    (_: any, index: number) => engine.port.removeOutDynamic(node.ports.out.dynamic[index]),
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

      await engine.port.addOutDynamic(node.id);

      scrollToBottom();
    },
    [onAdd, engine, node.id]
  );

  const reorderChoice = React.useCallback(
    (from: number, to: number) => {
      onReorder(from, to);

      engine.port.reorderOutDynamic(node.id, from, to);
    },
    [onReorder, engine, node]
  );

  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [buttonsOption, buttonsSection] = useButtonsOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={({ scrollToBottom }) =>
        choices.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            menu={<OverflowMenu placement="top-end" options={[noReplyOption, buttonsOption]} />}
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
            <NoMatchSection data={data.else} pushToPath={pushToPath} />
            {noReplySection}
          </>
        }
        onDelete={onRemove}
        onReorder={reorderChoice}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, pushToPath, isOnlyItem: choices.length === 1, platform, openIntents, choices }}
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
