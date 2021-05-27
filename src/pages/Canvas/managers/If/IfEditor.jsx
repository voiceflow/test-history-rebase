import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { FeatureFlag } from '@/config/features';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useFeature, useManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';

import { DraggableItem, HelpTooltip } from './components';
import { NODE_CONFIG } from './constants';
import IfEditorV2 from './IfEditorV2';

const expressionClone = (initVal, targetVal) => ({ ...initVal, type: targetVal.type, value: targetVal.value });
const expressionFactory = () => NODE_CONFIG.factory().data.expressions[0];

function IfEditor({ data, onChange, focusedNode }) {
  const [isDragging, toggleDragging] = useToggle(false);
  const engine = React.useContext(EngineContext);
  const updateExpressions = React.useCallback((expressions, save) => onChange({ expressions }, save), [onChange]);
  const onRemoveExpression = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [
    engine.port,
    focusedNode.ports.out,
  ]);

  const { items, onAdd, onRemove, onDuplicate, mapManaged, onReorder, latestCreatedKey } = useManager(data.expressions, updateExpressions, {
    clone: expressionClone,
    factory: expressionFactory,
    autosave: false,
    handleRemove: onRemoveExpression,
  });

  const addExpression = React.useCallback(
    async (scrollToBottom) => {
      onAdd();
      await engine.port.add(focusedNode.id, { label: items.length + 1 });
      scrollToBottom();
    },
    [engine.port, focusedNode.id, items.length, onAdd]
  );

  const reorderExpression = React.useCallback(
    (from, to) => {
      onReorder(from, to);

      engine.port.reorder(focusedNode.id, from + 1, to + 1);
    },
    [onReorder, engine.port, focusedNode.id]
  );

  const duplicateExpression = React.useCallback(
    (_, item) => {
      onDuplicate(item.index, item);
      engine.port.add(focusedNode.id, { label: items.length + 1 });
    },
    [onDuplicate, focusedNode.id]
  );

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            options={[
              {
                label: 'Add If Statement',
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
                  <a href={Documentation.CONDITION_STEP} target="_blank" rel="noopener noreferrer">
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
        items={items}
        onDelete={onRemove}
        onDuplicate={duplicateExpression}
        onReorder={reorderExpression}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged}
        onStartDrag={toggleDragging}
        itemComponent={DraggableItem}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={DraggableItem}
        withContextMenuDelete
        withContextMenuDuplicate
      />
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

const ConditionalIfEditor = (props) => {
  const conditionsBuilder = useFeature(FeatureFlag.CONDITIONS_BUILDER);

  if (conditionsBuilder.isEnabled) {
    return <IfEditorV2 {...props} />;
  }

  return <IfEditor {...props} />;
};

export default connect(mapStateToProps)(ConditionalIfEditor);
