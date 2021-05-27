import React, { SyntheticEvent } from 'react';

import Label from '@/components/Label';
import VariableSelect from '@/components/VariableSelect';

const AnyVariableSelect: any = VariableSelect;

export type ConditionVariableSelectProps = {
  value: string;
  onChange: (data: { value: string }) => void;
  onClick?: (event: SyntheticEvent<Element, Event>) => void;
  inputStopProp?: boolean;
};

const ConditionVariableSelect: React.FC<ConditionVariableSelectProps> = ({ value, onChange, inputStopProp }) => (
  <>
    <Label>Variable</Label>
    <AnyVariableSelect
      value={value}
      onChange={(value: string) => onChange({ value })}
      placeholder="Select or create variable"
      createInputPlaceholder="Search options"
      inputStopProp={inputStopProp}
    />
  </>
);

export default ConditionVariableSelect;
