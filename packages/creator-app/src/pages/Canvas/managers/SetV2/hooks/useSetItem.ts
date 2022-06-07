import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useDidUpdateEffect } from '@voiceflow/ui';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { useExpressionValidation } from '@/hooks';
import { transformVariableToString } from '@/utils/slot';

interface UseSetItemProps {
  item: Realtime.NodeData.SetExpressionV2;
  onUpdate: (value: Partial<Realtime.NodeData.SetExpressionV2>) => void;
}

const useSetItem = ({ item, onUpdate }: UseSetItemProps) => {
  const [error, resetError, isValidExpression, errorMessage] = useExpressionValidation();

  const updateExpression = React.useCallback(
    (text) => {
      if (!isEmpty(text) && isValidExpression(text)) {
        resetError();
        onUpdate({ expression: text });
      }
    },
    [isValidExpression, item.expression, onUpdate]
  );

  const updateVariable = React.useCallback((variable) => onUpdate({ variable }), [onUpdate]);

  useDidUpdateEffect(() => {
    if (item.type === BaseNode.Utils.ExpressionTypeV2.VALUE) {
      onUpdate({ expression: transformVariableToString(String(item.expression)) });
    }
    resetError();
  }, [item.type]);

  return { error, errorMessage, resetError, updateExpression, updateVariable };
};

export default useSetItem;
