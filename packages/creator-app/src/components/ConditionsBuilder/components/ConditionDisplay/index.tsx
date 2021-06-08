import { ExpressionTypeV2 } from '@voiceflow/general-types';
import React from 'react';

import { Flex } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { transformVariableToString } from '@/utils/slot';

import { ExpressionDisplayLabel } from '../../constants';
import { LogicUnitDataType } from '../../types';
import { isVariable } from '../../utils';
import ConditionDisplayContainer from './components/ConditionDisplayContainer';
import LabelWrapper from './components/LabelWrapper';

export type ConditionDisplayProps = {
  error?: boolean;
  onDelete?: () => void;
  expression: LogicUnitDataType;
  isActive: boolean;
  isLogicGroup?: boolean;
};
const ConditionDisplay: React.FC<ConditionDisplayProps> = ({ expression, isActive, onDelete, error, isLogicGroup }) => {
  const leftValue = isVariable(String(expression?.value?.[0]?.value))
    ? transformVariableToString(expression?.value?.[0]?.value as string)
    : expression.value[0]?.value;

  const logicType = expression.type;

  const rightValue = isVariable(String(expression?.value?.[1]?.value))
    ? transformVariableToString(expression?.value?.[1]?.value as string)
    : expression.value[1]?.value;

  const placeholder = !leftValue && expression.value[0]?.type === ExpressionTypeV2.VARIABLE ? 'Variable' : 'Value';

  return (
    <ConditionDisplayContainer isActive={isActive} isInvalid={error} isLogicGroup={isLogicGroup}>
      <LabelWrapper>
        <Text>
          <b>{leftValue || placeholder}</b> {ExpressionDisplayLabel[logicType!].toLowerCase()} <b>{rightValue}</b>
        </Text>
      </LabelWrapper>
      <Flex pr={16} pl={12}>
        <SvgIcon icon="close" size={10} color="#6e849a" onClick={onDelete} enableOpacity />
      </Flex>
    </ConditionDisplayContainer>
  );
};

export default ConditionDisplay;
