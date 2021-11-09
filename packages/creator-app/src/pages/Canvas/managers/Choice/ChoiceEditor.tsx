import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import OverflowMenu from '@/components/OverflowMenu';
import * as Creator from '@/ducks/creator';
import * as IntentV2 from '@/ducks/intentV2';
import { useManager, useSelector, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { NoMatchSection } from '@/pages/Canvas/components/NoMatch';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useButtonsOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { PlatformContext } from '@/pages/Project/contexts';

import DraggableItem from './components/DraggableItem';
import { NODE_CONFIG } from './constants';

const choiceFactory = () => NODE_CONFIG.factory().data.choices[0];

const ChoiceEditor: NodeEditor<Realtime.NodeData.Interaction> = ({ data, onChange, pushToPath }) => {
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;

  const openIntents = useSelector(IntentV2.openIntentsSelector);
  const focusedNode = useSelector(Creator.focusedNodeSelector)!;

  const [isDragging, toggleDragging] = useToggle(false);
  const { choices } = data;

  const updateChoices = React.useCallback((choices, save) => onChange({ choices }, save), [onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [engine.port, focusedNode.ports.out]);

  const { onAdd, mapManaged, onRemove, onReorder, latestCreatedKey } = useManager(choices, updateChoices, {
    factory: choiceFactory,
    autosave: false,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(
    async (scrollToBottom) => {
      onAdd();
      await engine.port.add(focusedNode.id, { label: String(choices.length + 1) });
      scrollToBottom();
    },
    [onAdd, engine.port, focusedNode.id, choices.length]
  );

  const reorderChoice = React.useCallback(
    (from, to) => {
      onReorder(from, to);

      engine.port.reorder(focusedNode.id, from + 1, to + 1);
    },
    [onReorder, engine.port, focusedNode.id]
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
                iconProps: { color: NODE_CONFIG.iconColor },
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
