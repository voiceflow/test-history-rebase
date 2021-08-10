import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { HelpTooltip } from '@/components/IntentForm';
import OverflowMenu from '@/components/OverflowMenu';
import * as Creator from '@/ducks/creator';
import { connect } from '@/hocs';
import { useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import ElseResponse from '@/pages/Canvas/managers/Choice/components/ElseResponse';
import { useButtonsOptionSection, useNoReplyOptionSection } from '@/pages/Canvas/managers/hooks';
import { PlatformContext } from '@/pages/Skill/contexts';

import { NODE_CONFIG } from '../constants';
import DraggableItem from './DraggableItem';

const choiceFactory = () => NODE_CONFIG.factory().data.choices[0];

function ChoiceManager({ data, onChange, focusedNode, pushToPath }) {
  const { choices } = data;

  const platform = React.useContext(PlatformContext);
  const engine = React.useContext(EngineContext);
  const [isDragging, toggleDragging] = useToggle(false);

  const updateChoices = React.useCallback((choices, save) => onChange({ choices }, save), [onChange]);
  const onRemoveChoice = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [engine.port, focusedNode.ports.out]);

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

  const [noReplyOption, noReplySection] = useNoReplyOptionSection({ data, onChange, pushToPath });
  const [buttonsOption, buttonsSection] = useButtonsOptionSection({ data, onChange, pushToPath });

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            menu={<OverflowMenu placement="top-end" options={[noReplyOption, buttonsOption]} />}
            options={[
              {
                label: 'Add Path',
                icon: 'choice',
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
        footer={
          <>
            {buttonsSection}
            <ElseResponse pushToPath={pushToPath} noMatches={data.else} />
            {noReplySection}
          </>
        }
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
        withContextMenuDelete
      />
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: Creator.focusedNodeSelector,
};

export default connect(mapStateToProps)(ChoiceManager);
