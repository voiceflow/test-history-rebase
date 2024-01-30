import { BaseNode } from '@voiceflow/base-types';
import { Box, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { Diagram } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { transformVariableToString } from '@/utils/slot';

import { ExpressionDisplayLabel } from '../../constants';
import { LogicUnitDataType } from '../../types';
import { isVariable } from '../../utils';
import ConditionDisplayContainer from './components/ConditionDisplayContainer';
import LabelWrapper from './components/LabelWrapper';

export interface ConditionDisplayProps {
  error?: boolean;
  onDelete?: () => void;
  expression: LogicUnitDataType;
  isActive: boolean;
  isLogicGroup?: boolean;
}
const ConditionDisplay: React.FC<ConditionDisplayProps> = ({ expression, isActive, onDelete, error, isLogicGroup }) => {
  const entitiesAndVariablesMap = useSelector(Diagram.active.entitiesAndVariablesMapSelector);

  const firstValue = expression?.value?.[0]?.value;
  const secondValue = expression?.value?.[1]?.value;
  const logicType = expression.type;

  const transformValue = (value: typeof firstValue, variables: typeof entitiesAndVariablesMap) => {
    if (isVariable(String(value))) {
      return transformVariableToString(String(value), variables);
    }

    return typeof value === 'string' ? entitiesAndVariablesMap[value]?.name ?? value : value;
  };

  const leftValue = React.useMemo(() => transformValue(firstValue, entitiesAndVariablesMap), [firstValue, entitiesAndVariablesMap]);
  const rightValue = React.useMemo(() => transformValue(secondValue, entitiesAndVariablesMap), [firstValue, entitiesAndVariablesMap]);

  const placeholder = !leftValue && expression.value[0]?.type === BaseNode.Utils.ExpressionTypeV2.VARIABLE ? 'Variable' : 'Value';

  return (
    <ConditionDisplayContainer isActive={isActive} isInvalid={error} isLogicGroup={isLogicGroup}>
      <LabelWrapper>
        {logicType && (
          <Text>
            <b>{String(leftValue) || placeholder}</b> {ExpressionDisplayLabel[logicType]?.toLowerCase()} <b>{String(rightValue)}</b>
          </Text>
        )}
      </LabelWrapper>

      <Box.Flex pr={16} pl={12}>
        <SvgIcon icon="close" size={10} color="#6e849a" onClick={onDelete} clickable />
      </Box.Flex>
    </ConditionDisplayContainer>
  );
};

export default ConditionDisplay;
