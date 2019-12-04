import React from 'react';

import { ExpressionType } from '@/constants';
import { swallowEvent } from '@/utils/dom';

import { evolveExpression } from '../utils';
import ExpressionAdvance from './ExpressionAdvance';
import ExpressionDefault from './ExpressionDefault';
import ExpressionNot from './ExpressionNot';
import ExpressionValue from './ExpressionValue';
import ExpressionVariable from './ExpressionVariable';

const FormComponent = ({ value, onChange, variables, parentType }) => (
  <ExpressionForm expression={value} onChange={onChange} variables={variables} parentType={parentType} />
);

function ExpressionForm({ onChange, expression, variables, parentType }) {
  const cachedExpression = React.useRef(expression);

  cachedExpression.current = expression;

  const onChangeType = React.useCallback(
    (type) => {
      if (type === cachedExpression.current.type) return;

      onChange(evolveExpression(cachedExpression.current, type));
    },
    [onChange]
  );

  const onCollapseExpression = React.useMemo(
    () =>
      swallowEvent(() => {
        if (Array.isArray(cachedExpression.current.value)) {
          onChange({ ...cachedExpression.current, type: cachedExpression.current.value[0].type, value: cachedExpression.current.value[0].value });
        } else if (cachedExpression.current.value && cachedExpression.current.value.type) {
          onChange({ ...cachedExpression.current, type: cachedExpression.current.value.type, value: cachedExpression.current.value.value });
        }
      }),
    [onChange]
  );

  const onChangeAdvanced = React.useCallback((value) => {
    if (cachedExpression.current.type !== ExpressionType.ADVANCE) {
      return;
    }

    onChange({ ...cachedExpression.current, value });
  });

  const onChangeValue = React.useCallback((value) => onChange({ ...cachedExpression.current, value }), [onChange]);

  if (!expression?.type) {
    return null;
  }

  const { type, value, depth } = expression;

  switch (expression.type) {
    case ExpressionType.VARIABLE:
      return <ExpressionVariable value={value} depth={depth} onChange={onChangeValue} onUpdateType={onChangeType} />;
    case ExpressionType.VALUE:
      return <ExpressionValue value={value} depth={depth} onChange={onChangeValue} onUpdateType={onChangeType} />;
    case ExpressionType.ADVANCE:
      return <ExpressionAdvance value={value} depth={depth} onChange={onChangeAdvanced} variables={variables} onUpdateType={onChangeType} />;
    case ExpressionType.NOT:
      return (
        <ExpressionNot
          type={type}
          value={value}
          depth={depth}
          onChange={onChangeValue}
          onCollapse={onCollapseExpression}
          parentType={parentType}
          onUpdateType={onChangeType}
          formComponent={FormComponent}
        />
      );
    default:
      return (
        <ExpressionDefault
          type={type}
          value={value}
          onChange={onChangeValue}
          onCollapse={onCollapseExpression}
          onUpdateType={onChangeType}
          parentType={parentType}
          formComponent={FormComponent}
        />
      );
  }
}

export default ExpressionForm;
