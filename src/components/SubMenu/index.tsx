import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';

import { Container, MenuItem } from './components';

export type Item = {
  icon: Icon;
  value: string;
};

export type SubMenuProps = {
  options: Item[];
  selected?: string;
};

const SubMenu: React.FC<SubMenuProps> = ({ options, selected }) => {
  const [selectedOption, setSelectedOption] = React.useState(selected || options?.[0].value || '');

  return (
    <Container>
      {options.map((option: Item, i) => {
        const isSelectedOption = option.value === selectedOption;
        return (
          <MenuItem key={i} selected={isSelectedOption} onClick={() => setSelectedOption(option.value)}>
            <TippyTooltip title={option.value} position="right">
              <SvgIcon icon={option.icon} color={isSelectedOption ? '#132144' : '#6e849a'} />
            </TippyTooltip>
          </MenuItem>
        );
      })}
    </Container>
  );
};

export default SubMenu;
