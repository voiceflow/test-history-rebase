import { ExpressionTypeV2 } from '@voiceflow/general-types';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Flex } from '@/components/Box';
import SvgIcon from '@/components/SvgIcon';
import Text from '@/components/Text';
import { transformVariableToString } from '@/utils/slot';

import { ExpressionDisplayLabel } from '../constants';
import { LogicUnitDataType } from '../types';
import ConditionDisplayContainer from './ConditionDisplayContainer';

export type ConditionDisplayProps = {
  error?: boolean;
  onDelete: () => void;
  expression: LogicUnitDataType;
};
const ConditionDisplay: React.FC<ConditionDisplayProps> = ({ expression, onDelete, error }) => {
  const leftValue =
    expression?.value?.[0]?.type === ExpressionTypeV2.VARIABLE
      ? transformVariableToString(expression?.value?.[0]?.value)
      : expression.value[0]?.value;
  const rightValue =
    expression?.value?.[1]?.type === ExpressionTypeV2.VARIABLE
      ? transformVariableToString(expression?.value?.[1]?.value)
      : expression.value[1]?.value;
  const logicType = expression.type;

  const placeholder = !leftValue && expression.value[0]?.type === ExpressionTypeV2.VARIABLE ? 'Variable' : 'Value';

  return (
    <ConditionDisplayContainer isInvalid={error}>
      <Flex flexWrap="wrap">
        <Text fontWeight={600}>{leftValue || placeholder}</Text>

        {!isEmpty(leftValue) && <Text fontWeight={500}>{ExpressionDisplayLabel[logicType].toLowerCase()}</Text>}
        {!isEmpty(rightValue) && <Text fontWeight={600}>{rightValue}</Text>}
      </Flex>
      <Flex pr={16} pl={12}>
        <SvgIcon icon="close" size={10} color="#6e849a" onClick={onDelete} />
      </Flex>
    </ConditionDisplayContainer>
  );
};

export default ConditionDisplay;
