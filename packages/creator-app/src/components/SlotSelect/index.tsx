import { Utils } from '@voiceflow/common';
import { BaseSelectProps, FlexApart, Select } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

export interface SlotOption {
  label: string;
  value: string;
}

interface SlotSelectProps extends BaseSelectProps {
  value?: string | null;
  filter?: (value: SlotOption, index: number, array: SlotOption[]) => boolean;
  onChange: (value: string) => void;
}

const slotOptionRenderer = (option: SlotOption) => <FlexApart fullWidth>{option.label}</FlexApart>;

const SlotSelect: React.FC<SlotSelectProps> = ({ value, onChange, className, filter, ...props }) => {
  const slotTypes = useSelector(VersionV2.active.slotTypesSelector);

  const options = React.useMemo(() => (filter ? slotTypes.filter(filter) : slotTypes), [slotTypes, filter]);
  const selected = React.useMemo(() => slotTypes.find((slotType) => slotType.value === value) ?? null, [slotTypes, value]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options, Utils.object.selectValue), [options]);

  return (
    <Select
      value={selected?.value}
      options={options}
      onSelect={onChange}
      searchable
      optionsMaxSize={9.5}
      createInputPlaceholder="types"
      placeholder="Select entity type"
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      renderOptionLabel={slotOptionRenderer}
      {...props}
    />
  );
};

export default SlotSelect;
