import React from 'react';

import Box from '@/components/Box';
import BaseDropdown from '@/components/Dropdown';
import SvgIcon from '@/components/SvgIcon';

import Button from './Button';

export type DropdownProps = {
  options: { label: string; onClick: () => void }[];
  value?: string;
  noBorder?: boolean;
  placeholder?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ options, value, placeholder, noBorder = false }) => {
  return (
    <BaseDropdown options={options} placement="bottom-start">
      {(ref: React.Ref<any>, onToggle: any, isOpen: boolean) => (
        <Button ref={ref} onClick={onToggle} isOpen={isOpen} noBorder={noBorder}>
          {value || <Box color="#62778c">{placeholder}</Box>}
          <SvgIcon icon="caretDown" color={isOpen ? '5D9DF5' : ''} size={7} />
        </Button>
      )}
    </BaseDropdown>
  );
};

export default Dropdown;
