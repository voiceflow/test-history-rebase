import React, { SyntheticEvent } from 'react';

import Label from '@/components/Label';
import VariableSelect from '@/components/VariableSelect';

export interface ConditionVariableSelectProps {
  value: string;
  onChange: (data: { value: string }) => void;
  onClick?: (event: SyntheticEvent<Element, Event>) => void;
  inputStopProp?: boolean;
}

const ConditionVariableSelect: React.FC<ConditionVariableSelectProps> = ({ value, onChange, inputStopProp }) => (
  <>
    <Label>Variable</Label>

    <VariableSelect
      value={value}
      onChange={(value: string) => onChange({ value })}
      placeholder="Select or create variable"
      inputStopProp={inputStopProp}
      createInputPlaceholder="Search options"
    />
  </>
);

export default ConditionVariableSelect;
