import { Utils } from '@voiceflow/common';
import { BaseSelectProps, createUIOnlyMenuItemOption, isNotUIOnlyMenuItemOption, Select } from '@voiceflow/ui';
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

const SlotSelect: React.FC<SlotSelectProps> = ({ value, onChange, className, filter, ...props }) => {
  const slotTypes = useSelector(VersionV2.active.slotTypesSelector);

  const options = React.useMemo(
    () =>
      filter
        ? slotTypes.filter(filter)
        : [slotTypes[0], slotTypes[1], createUIOnlyMenuItemOption('divider', { divider: true }), ...slotTypes.slice(2)],
    [slotTypes, filter]
  );
  const selected = React.useMemo(() => slotTypes.find((slotType) => slotType.value === value) ?? null, [slotTypes, value]);
  const optionsMap = React.useMemo(() => Utils.array.createMap(options.filter(isNotUIOnlyMenuItemOption), Utils.object.selectValue), [options]);

  return (
    <Select
      value={selected?.value}
      label={selected?.label}
      options={options}
      onSelect={onChange}
      isDropdown
      searchable
      placeholder="Select entity type"
      getOptionKey={(option) => option.value}
      optionsMaxSize={9.5}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      labelSearchable={false}
      inDropdownSearch
      alwaysShowCreate
      createInputPlaceholder="types"
      {...props}
    />
  );
};

export default SlotSelect;
