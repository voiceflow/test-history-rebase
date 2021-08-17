import { Node } from '@voiceflow/base-types';
import { BoxFlex, SvgIcon, Text } from '@voiceflow/ui';
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
  const leftValue = isVariable(String(expression?.value?.[0]?.value))
    ? transformVariableToString(expression?.value?.[0]?.value as string)
    : expression.value[0]?.value;

  const logicType = expression.type;

  const rightValue = isVariable(String(expression?.value?.[1]?.value))
    ? transformVariableToString(expression?.value?.[1]?.value as string)
    : expression.value[1]?.value;

  const placeholder = !leftValue && expression.value[0]?.type === Node.Utils.ExpressionTypeV2.VARIABLE ? 'Variable' : 'Value';

  return (
    <ConditionDisplayContainer isActive={isActive} isInvalid={error} isLogicGroup={isLogicGroup}>
      <LabelWrapper>
        <Text>
          <b>{leftValue || placeholder}</b> {ExpressionDisplayLabel[logicType!].toLowerCase()} <b>{rightValue}</b>
        </Text>
      </LabelWrapper>

      <BoxFlex pr={16} pl={12}>
        <SvgIcon icon="close" size={10} color="#6e849a" onClick={onDelete} enableOpacity />
      </BoxFlex>
    </ConditionDisplayContainer>
  );
};

export default ConditionDisplay;
