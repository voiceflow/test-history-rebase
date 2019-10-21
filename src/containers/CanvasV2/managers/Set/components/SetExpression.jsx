import React from 'react';

import ExpressionEditor from '@/components/ExpressionEditor';
import InlineFormControl from '@/components/InlineFormControl';
import VariableSelect from '@/componentsV2/VariableSelect';
import { RemovableSection } from '@/containers/CanvasV2/components/BlockEditor';

const SetExpression = ({ set, onRemove, onUpdate }) => {
  const updateVariable = (variable) => onUpdate({ variable });
  const updateExpression = (expression) => onUpdate({ expression: { ...set.expression, ...expression } });

  return (
    <RemovableSection onClose={onRemove}>
      <InlineFormControl className="py-0 mb-3">
        <span className="text-bold-label">Set</span>
        <VariableSelect value={set.variable} onChange={updateVariable} />
        <span className="text-bold-label">to:</span>
      </InlineFormControl>

      <ExpressionEditor expression={set.expression} onChange={updateExpression} />
    </RemovableSection>
  );
};

export default SetExpression;
