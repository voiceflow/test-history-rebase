import React from 'react';

import Button from '@/componentsV2/Button';
import { Content } from '@/containers/CanvasV2/components/BlockEditor';
import { useManager } from '@/hooks';

import SetExpression from './components/SetExpression';

const MAX_SETS = 20;

const setFactory = () => ({
  expression: {
    type: 'value',
    value: '',
    depth: 0,
  },
});

function SetEditor({ data, onChange }) {
  const updateSets = React.useCallback((sets) => onChange({ sets }), [onChange]);

  const { items, onAdd, mapManaged } = useManager(data.sets, updateSets, { factory: setFactory });

  return (
    <Content>
      {mapManaged((set, { key, onRemove, onUpdate }) => (
        <SetExpression set={set} onRemove={items.length > 1 && onRemove} onUpdate={onUpdate} key={key} />
      ))}
      {items.length < MAX_SETS && (
        <div className="editor-flex-container">
          <Button variant="secondary" onClick={onAdd}>
            Add Variable Set
          </Button>
        </div>
      )}
    </Content>
  );
}

export default SetEditor;
