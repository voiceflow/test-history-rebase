import React from 'react';

import Label from '@/components/Label';
import VariableSelect from '@/components/VariableSelect';

const AnyVariableSelect: any = VariableSelect;

export type ConditionVariableSelectProps = {
  value: string;
  onChange: (data: { value: string }) => void;
};

const ConditionVariableSelect: React.FC<ConditionVariableSelectProps> = ({ value, onChange }) => (
  <>
    <Label>Variable</Label>
    <AnyVariableSelect
      value={value}
      onChange={(value: string) => onChange({ value })}
      placeholder="Select or create variable"
      createInputPlaceholder="Search options"
    />
  </>
);

export default ConditionVariableSelect;
