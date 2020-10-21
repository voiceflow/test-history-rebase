import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { PrototypeMode } from '@/ducks/prototype/types';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import Drawer from '../Drawer';
import { Container, MenuItem } from './components';
import { SUBMENU_WIDTH } from './constants';

export type SubMenuItem = {
  icon: Icon;
  value: PrototypeMode;
};

export type SubMenuProps = {
  options: SubMenuItem[];
  selected?: string;
};

const SubMenu: React.FC<SubMenuProps> = ({ options, selected }) => {
  const [selectedOption, setSelectedOption] = React.useState(selected || options?.[0].value || '');
  const isPrototypingMode = usePrototypingMode();

  return (
    <Drawer as="section" open={isPrototypingMode} width={SUBMENU_WIDTH} direction={SlideOutDirection.RIGHT}>
      <Container>
        {options.map((option: SubMenuItem, i) => {
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
    </Drawer>
  );
};

export default SubMenu;
