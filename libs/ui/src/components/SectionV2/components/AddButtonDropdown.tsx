import type { UIOnlyMenuItemOption } from '@ui/components/NestedMenu';
import { defaultMenuLabelRenderer } from '@ui/components/NestedMenu';
import type { OptionsMenuOption } from '@ui/components/OptionsMenu';
import type { BaseSelectProps } from '@ui/components/Select';
import Select from '@ui/components/Select';
import type { SvgIconTypes } from '@ui/components/SvgIcon';
import SvgIcon from '@ui/components/SvgIcon';
import { Utils } from '@voiceflow/common';
import React from 'react';

import AddButton from './AddButton';

export interface Option extends OptionsMenuOption {
  icon?: SvgIconTypes.Icon;
}

export interface Props {
  actions: Array<Option | UIOnlyMenuItemOption | null>;
  disabled?: boolean;
  placement?: BaseSelectProps['placement'];
  maxHeight?: BaseSelectProps['maxHeight'];
}

const AddButtonDropdown: React.FC<Props> = ({ actions, disabled, placement = 'bottom-end', maxHeight }) => {
  const options = actions.filter(Utils.array.isNotNullish);

  return (
    <Select<Option>
      options={options}
      minWidth={false}
      maxHeight={maxHeight}
      onSelect={(option) => option.onClick?.()}
      disabled={disabled || !options.length}
      modifiers={{ offset: { enabled: true, offset: '10,10' } }}
      placement={placement}
      getOptionKey={(_, index) => String(index)}
      isMultiLevel
      renderTrigger={({ ref, isOpen, onClick }) => (
        <AddButton
          ref={ref as React.RefObject<HTMLButtonElement>}
          onClick={onClick}
          disabled={disabled || !options.length}
          isActive={isOpen}
        />
      )}
      getOptionLabel={(option) => option?.label}
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, config) => (
        <>
          {option.icon && <SvgIcon icon={option.icon} size={16} color="#6e849a" mr={16} />}
          {defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue, config)}
        </>
      )}
    />
  );
};

export default AddButtonDropdown;
