import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { MapManaged, useManager, useToggle } from '@/hooks';
import { ExpressionData, NodeData } from '@/models';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { MAX_ITEMS_PER_EDITOR } from '@/pages/Canvas/constants';
import { EngineContext } from '@/pages/Canvas/contexts';
import { NodeEditor } from '@/pages/Canvas/managers/types';
import { ConnectedProps } from '@/types';

import { ConditionsSection, HelpTooltip, NoMatchSection } from './components';
import { NODE_CONFIG } from './constants';

const setClone = (initVal: any, targetVal: ExpressionData) => ({
  ...initVal,
  name: targetVal.name,
  value: targetVal.value,
});

const expressionFactory = () => NODE_CONFIG.factory(undefined).data.expressions[0];

const IfEditor: NodeEditor<NodeData.IfV2 & ConnectedCommentingUpdatesProps> = ({ data, pushToPath, onChange, focusedNode }) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const engine = React.useContext(EngineContext)!;
  const updateExpressions = React.useCallback((expressions, save) => onChange({ expressions }, save), [onChange]);
  const onRemoveExpression = React.useCallback(
    (_, index) => engine.port.remove(focusedNode!.ports!.out![index + 1] as string),
    [engine.port, focusedNode!.ports!.out]
  );

  const { items, onAdd, onRemove, onDuplicate, mapManaged, onReorder, latestCreatedKey } = useManager(data.expressions, updateExpressions, {
    factory: () => expressionFactory(),
    autosave: false,
    handleRemove: onRemoveExpression,
    clone: setClone,
  } as any);

  const reorderExpressions = React.useCallback(
    (from: number, to: number) => {
      onReorder(from, to);

      engine.port.reorder(focusedNode!.id!, from + 1, to + 1);
    },
    [onReorder, engine.port, focusedNode!.id!]
  );

  const addExpression = React.useCallback(
    async (scrollToBottom: (behavior?: ScrollBehavior) => void) => {
      onAdd();
      await engine.port.add(focusedNode!.id!, { label: (items.length + 1).toString() });
      scrollToBottom();
    },
    [engine.port, items.length, onAdd]
  );

  const onDuplicationExp = React.useCallback(
    (_, item) => {
      onDuplicate(item.index, item);
      engine.port.add(focusedNode!.id as string, { label: (items.length + 1).toString() });
    },
    [onDuplicate, focusedNode!.id]
  );

  return (
    <Content
      footer={({ scrollToBottom }) =>
        items.length < MAX_ITEMS_PER_EDITOR ? (
          <Controls
            options={[
              {
                label: 'Add Condition',
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
                  <a href="https://docs.voiceflow.com/#/steps/condition" target="_blank" rel="noopener noreferrer">
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
        onDelete={onRemove}
        onDuplicate={onDuplicationExp}
        onReorder={reorderExpressions}
        onEndDrag={toggleDragging}
        footer={<NoMatchSection noMatch={data.noMatch} pushToPath={pushToPath} />}
        itemProps={{ latestCreatedKey, isOnlyItem: items.length === 1 }}
        mapManaged={mapManaged as MapManaged<ExpressionData>}
        onStartDrag={toggleDragging}
        itemComponent={ConditionsSection}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={ConditionsSection}
        withContextMenuDelete
        withContextMenuDuplicate
      />
    </Content>
  );
};

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

type ConnectedCommentingUpdatesProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(IfEditor);
