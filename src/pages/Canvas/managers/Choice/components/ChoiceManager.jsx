import cuid from 'cuid';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import OverflowMenu from '@/components/OverflowMenu';
import { PlatformType } from '@/constants';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor/components';
import NoReplyResponse, { repromptFactory } from '@/pages/Canvas/components/NoReplyResponse';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';

import DraggableItem from './DraggableItem';

const choiceFactory = () => ({
  [PlatformType.ALEXA]: { id: cuid.slug(), intent: null, mappings: [] },
  [PlatformType.GOOGLE]: { id: cuid.slug(), intent: null, mappings: [] },
});

function ChoiceManager({ data, platform, onChange, focusedNode, pushToPath }) {
  const { choices } = data;

  const engine = React.useContext(EngineContext);
  const [isDragging, toggleDragging] = useToggle(false);

  const updateChoices = React.useCallback((choices, save) => onChange({ choices }, save), [onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [engine.port, focusedNode.ports.out]);

  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);

  const { onAdd, mapManaged, onRemove, onReorder, latestCreatedKey, items } = useManager(choices, updateChoices, {
    factory: choiceFactory,
    autosave: false,
    handleRemove: onRemoveChoice,
  });

  const addChoice = React.useCallback(
    async (scrollToBottom) => {
      onAdd();
      await engine.port.add(focusedNode.id, { label: choices.length + 1 });
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

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            menu={
              <OverflowMenu
                placement="top-end"
                options={[
                  {
                    label: hasReprompt ? 'Remove No Reply Response' : 'Add  No Reply Response',
                    onClick: toggleReprompt,
                  },
                ]}
              />
            }
            options={[
              {
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
        items={items}
        onDelete={onRemove}
        onReorder={reorderChoice}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, pushToPath, items, isOnlyItem: items.length === 1, platform }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        footer={hasReprompt && <NoReplyResponse pushToPath={pushToPath} />}
      />
    </Content>
  );
}

const mapStateToProps = {
  platform: activePlatformSelector,
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(ChoiceManager);
