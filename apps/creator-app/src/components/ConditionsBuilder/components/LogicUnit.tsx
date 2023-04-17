import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { BaseLogicType, LogicUnitDataType } from '../types';
import ConditionDataSelect from './ConditionDataSelect';
import ConditionLabel from './ConditionLabel';

export interface LogicUnitProps {
  firstItem?: boolean;
  isLogicGroup?: boolean;
  expression: LogicUnitDataType;
  baseLogicType: BaseLogicType;

  onDelete: () => void;
  onDataChange: (value: Realtime.ExpressionV2) => void;
  updateBaseType: (value: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => void;
}

const LogicUnit: React.FC<LogicUnitProps> = ({ baseLogicType, updateBaseType, expression, onDataChange, onDelete, firstItem, isLogicGroup }) => {
  const label = firstItem ? 'IF' : baseLogicType?.toUpperCase();

  return (
    <Box.FlexAlignStart mb={16}>
      <ConditionLabel actionable={!firstItem} onChange={updateBaseType}>
        {label}
      </ConditionLabel>

      <ConditionDataSelect isLogicGroup={isLogicGroup} expression={expression} onChange={onDataChange} onDelete={onDelete} />
    </Box.FlexAlignStart>
  );
};

export default LogicUnit;
