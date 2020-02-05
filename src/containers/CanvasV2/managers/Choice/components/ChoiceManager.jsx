import cuid from 'cuid';
import React from 'react';

import { HelpTooltip } from '@/components/IntentForm';
import DraggableList, { DeleteComponent } from '@/componentsV2/DraggableList';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import { Content, Controls, MaxOptionsMessage } from '@/containers/CanvasV2/components/Editor/components';
import NoReplyResponse, { repromptFactory } from '@/containers/CanvasV2/components/NoReplyResponse';
import { MAX_ITEMS_PER_EDITOR } from '@/containers/CanvasV2/constants';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';

import DraggableItem from './DraggableItem';

const choiceFactory = () => ({
  id: cuid.slug(),
  open: true,
  mappings: [],
});

function ChoiceManager({ data, platform, onChange, focusedNode, pushToPath }) {
  const choices = data[platform];
  const engine = React.useContext(EngineContext);
  const [isDragging, toggleDragging] = useToggle(false);

  const updateChoices = React.useCallback((nextChoices, save) => onChange({ [platform]: nextChoices }, save), [platform, onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [engine.port, focusedNode.ports.out]);

  const hasReprompt = !!data.reprompt;
  const toggleReprompt = React.useCallback(() => onChange({ reprompt: hasReprompt ? null : repromptFactory() }), [hasReprompt, onChange]);

  const { onAdd, mapManaged, onRemove, onReorder, latestCreatedKey, items } = useManager(choices, updateChoices, {
    autosave: false,
    factory: choiceFactory,
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
        onReorder={onReorder}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, pushToPath, items, isOnlyItem: items.length === 1 }}
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
