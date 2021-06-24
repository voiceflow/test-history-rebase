import { Box, Dropdown as BaseDropdown, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Button from './Button';

export type DropdownProps = {
  options: { label: string; onClick: () => void }[];
  value?: string;
  noBorder?: boolean;
  placeholder?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ options, value, placeholder, noBorder = false }) => (
  <BaseDropdown options={options} placement="bottom-start">
    {(ref: React.Ref<any>, onToggle: any, isOpen: boolean) => (
      <Button ref={ref} onClick={onToggle} isOpen={isOpen} noBorder={noBorder}>
        {value || <Box color="#62778c">{placeholder}</Box>}
        <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : ''} size={7} />
      </Button>
    )}
  </BaseDropdown>
);

export default Dropdown;
