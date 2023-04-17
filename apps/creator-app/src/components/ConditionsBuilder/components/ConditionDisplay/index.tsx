import { BaseNode } from '@voiceflow/base-types';
import { Box, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

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
  const firstValue = expression?.value?.[0]?.value;
  const secondValue = expression?.value?.[1]?.value;
  const logicType = expression.type;

  const leftValue = isVariable(String(firstValue)) ? transformVariableToString(String(firstValue)) : firstValue;
  const rightValue = isVariable(String(secondValue)) ? transformVariableToString(String(secondValue)) : secondValue;

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
