import type { BaseSelectProps } from '@voiceflow/ui';
import { createDividerMenuItemOption, Select } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks/redux';

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
  const slotTypes = useSelector(VersionV2.active.entityTypesSelector);
  const slotTypesMap = useSelector(VersionV2.active.entityTypesMapSelector);

  const options = React.useMemo(
    () =>
      (filter
        ? slotTypes.filter(filter)
        : [slotTypes[0], slotTypes[1], createDividerMenuItemOption(), ...slotTypes.slice(2)]
      ).filter(Boolean),
    [slotTypes, filter]
  );
  const selected = React.useMemo(() => (value ? slotTypesMap[value] ?? null : null), [slotTypesMap, value]);

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
      getOptionLabel={(value) => value && slotTypesMap[value]?.label}
      labelSearchable={false}
      inDropdownSearch
      alwaysShowCreate
      createInputPlaceholder="types"
      {...props}
    />
  );
};

export default SlotSelect;
