import { UIOnlyMenuItemOption } from '@ui/components/NestedMenu';
import { OptionsMenuOption } from '@ui/components/OptionsMenu';
import Select, { BaseSelectProps } from '@ui/components/Select';
import { Utils } from '@voiceflow/common';
import React from 'react';

import AddButton from './AddButton';

export interface AddButtonDropdownProps {
  actions: Array<OptionsMenuOption | UIOnlyMenuItemOption | null>;
  disabled?: boolean;
  placement?: BaseSelectProps['placement'];
}

const AddButtonDropdown: React.FC<AddButtonDropdownProps> = ({ actions, disabled, placement = 'bottom-end' }) => (
  <Select<OptionsMenuOption>
    options={actions.filter(Utils.array.isNotNullish)}
    minWidth={false}
    onSelect={(option) => option.onClick?.()}
    disabled={disabled}
    modifiers={{ offset: { enabled: true, offset: '10,10' } }}
    placement={placement}
    getOptionKey={(_, index) => String(index)}
    isMultiLevel
    renderTrigger={({ ref, isOpen, onClick }) => (
      <AddButton ref={ref as React.RefObject<HTMLButtonElement>} onClick={onClick} disabled={disabled} isActive={isOpen} />
    )}
    getOptionLabel={(option) => option?.label}
  />
);

export default AddButtonDropdown;
