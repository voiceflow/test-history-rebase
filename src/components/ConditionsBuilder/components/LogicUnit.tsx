import { ExpressionTypeV2, ExpressionV2 } from '@voiceflow/general-types';
import React from 'react';

import { FlexAlignStart } from '@/components/Box';

import { LogicUnitDataType } from '../types';
import ConditionDataSelect from './ConditionDataSelect';
import ConditionLabel from './ConditionLabel';

export type LogicUnitProps = {
  firstItem?: boolean;
  expression: LogicUnitDataType;
  baseLogicType?: ExpressionTypeV2.AND | ExpressionTypeV2.OR;

  onDelete: () => void;
  onDataChange: (value: ExpressionV2) => void;
  updateBaseType: (value: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => void;
};

const LogicUnit: React.FC<LogicUnitProps> = ({ baseLogicType, updateBaseType, expression, onDataChange, onDelete, firstItem }) => {
  const label = firstItem ? 'IF' : baseLogicType?.toUpperCase();

  return (
    <FlexAlignStart mb={16}>
      <ConditionLabel actionable={!firstItem} onChange={updateBaseType}>
        {label}
      </ConditionLabel>
      <ConditionDataSelect expression={expression} onChange={onDataChange} onDelete={onDelete} />
    </FlexAlignStart>
  );
};

export default LogicUnit;
