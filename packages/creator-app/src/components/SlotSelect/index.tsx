import { FlexApart, Select, SelectProps } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import { useSelector } from '@/hooks';

export interface SlotOption {
  label: string;
  value: string;
}

type SlotSelectProps = Omit<Partial<SelectProps<SlotOption, string>>, 'onSelect' | 'creatable' | 'onCreate'> & {
  filter?: (value: SlotOption, index: number, array: SlotOption[]) => boolean;
  onChange: (value: string) => void;
};

const slotOptionRenderer = (option: SlotOption) => <FlexApart fullWidth>{option.label}</FlexApart>;

const SlotSelect: React.FC<SlotSelectProps> = ({ value, onChange, className, filter, ...props }) => {
  const slotTypes = useSelector(Version.activeSlotTypesSelector);

  const selected = slotTypes.find((slotType) => slotType.value === value) || null;
  const options = React.useMemo(() => (filter ? slotTypes.filter(filter) : slotTypes), [slotTypes, filter]);

  return (
    <Select
      value={selected ? selected.label : null}
      options={options}
      onSelect={onChange}
      searchable
      placeholder="Select Entity Type"
      getOptionValue={(option) => option?.value}
      renderOptionLabel={slotOptionRenderer}
      {...props}
    />
  );
};

export default SlotSelect;
