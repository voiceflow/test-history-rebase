import { BaseNode } from '@voiceflow/base-types';
import { Select } from '@voiceflow/ui';
import React from 'react';

import { ExpressionDisplayLabel } from '@/components/ConditionsBuilder/constants';
import { ExpressionDataLogicType } from '@/components/ConditionsBuilder/types';

const options: ExpressionDataLogicType[] = [
  BaseNode.Utils.ExpressionTypeV2.EQUALS,
  BaseNode.Utils.ExpressionTypeV2.NOT_EQUAL,
  BaseNode.Utils.ExpressionTypeV2.GREATER,
  BaseNode.Utils.ExpressionTypeV2.GREATER_OR_EQUAL,
  BaseNode.Utils.ExpressionTypeV2.LESS,
  BaseNode.Utils.ExpressionTypeV2.LESS_OR_EQUAL,
  BaseNode.Utils.ExpressionTypeV2.CONTAINS,
  BaseNode.Utils.ExpressionTypeV2.NOT_CONTAIN,
  BaseNode.Utils.ExpressionTypeV2.STARTS_WITH,
  BaseNode.Utils.ExpressionTypeV2.ENDS_WITH,
  BaseNode.Utils.ExpressionTypeV2.HAS_VALUE,
  BaseNode.Utils.ExpressionTypeV2.IS_EMPTY,
];

export interface ConditionLogicSelectProps {
  value?: ExpressionDataLogicType;
  onChange: (value: ExpressionDataLogicType) => void;
  onOpen: VoidFunction;
  onClose: VoidFunction;
}

const ConditionLogicSelect: React.FC<ConditionLogicSelectProps> = ({ value, onChange, onOpen, onClose }) => {
  return (
    <Select
      isDropdown
      minWidth={false}
      minMenuWidth={200}
      autoWidth={false}
      fullWidth
      label={value ? ExpressionDisplayLabel[value] : ''}
      options={options}
      getOptionLabel={(id) => id && ExpressionDisplayLabel[id]}
      onSelect={(id) => (id !== null ? onChange(id) : undefined)}
      borderLess
      onOpen={onOpen}
      onBlur={onClose}
    />
  );
};

export default ConditionLogicSelect;
