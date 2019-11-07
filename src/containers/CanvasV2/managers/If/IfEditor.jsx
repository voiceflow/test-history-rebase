import React from 'react';

import ExpressionEditor from '@/components/ExpressionEditor';
import Button from '@/componentsV2/Button';
import Flex from '@/componentsV2/Flex';
import { ExpressionType } from '@/constants';
import { Content, RemovableSection } from '@/containers/CanvasV2/components/BlockEditor';
import { EngineContext } from '@/containers/CanvasV2/contexts';
import { focusedNodeSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import { useManager } from '@/hooks';

const MAX_EXPRESSIONS = 22;

const expressionFactory = () => ({
  type: ExpressionType.EQUALS,
  depth: 0,
  value: [
    {
      depth: 1,
      type: ExpressionType.VARIABLE,
      value: null,
    },
    {
      depth: 1,
      type: ExpressionType.VALUE,
      value: '',
    },
  ],
});

function IfEditor({ data, onChange, focusedNode }) {
  const engine = React.useContext(EngineContext);
  const updateExpressions = React.useCallback((expressions, save) => onChange({ expressions }, save), [onChange]);
  const onRemoveExpression = React.useCallback((_, index) => engine.port.remove(focusedNode.ports.out[index + 1]), [focusedNode.ports.out]);

  const { items, onAdd, mapManaged } = useManager(data.expressions, updateExpressions, {
    autosave: false,
    factory: expressionFactory,
    handleRemove: onRemoveExpression,
  });

  const addExpression = React.useCallback(() => {
    onAdd();
    engine.port.add(focusedNode.id, { label: items.length + 1 });
  }, [focusedNode.id, items.length, onAdd]);

  return (
    <Content>
      {mapManaged((expression, { key, index, onRemove, onUpdate }) => (
        <RemovableSection onClose={items.length > 1 && onRemove} key={key}>
          <Flex>
            <div className="number-bubble mr-2">{index + 1}</div>
            <span className="text-bold-label">If</span>
          </Flex>
          <ExpressionEditor expression={expression} onChange={onUpdate} />
        </RemovableSection>
      ))}
      <div className="editor-flex-container">
        {items.length < MAX_EXPRESSIONS ? (
          <Button variant="secondary" onClick={addExpression}>
            Add If Statement
          </Button>
        ) : (
          <div className="text-center text-dull mt-4">Maximum options reached</div>
        )}
      </div>
    </Content>
  );
}

const mapStateToProps = {
  focusedNode: focusedNodeSelector,
};

export default connect(mapStateToProps)(IfEditor);
