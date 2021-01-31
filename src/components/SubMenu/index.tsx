import React from 'react';
import { useTheme } from 'styled-components';

import SvgIcon, { Icon } from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { PrototypeMode } from '@/ducks/prototype/types';
import { Theme } from '@/styles/theme';
import { SlideOutDirection } from '@/styles/transitions';

import Drawer from '../Drawer';
import { ActiveIndicator, Container, MenuItem } from './components';

export type SubMenuItem = {
  icon: Icon;
  value: PrototypeMode;
};

export type SubMenuProps = {
  open: boolean;
  options: SubMenuItem[];
  selected?: string;
  onChange?: (value: string) => void;
};

const SubMenu: React.FC<SubMenuProps> = ({ open, options, selected, onChange }) => {
  const theme = useTheme() as Theme;
  const [selectedOption, setSelectedOption] = React.useState(selected || options?.[0].value || '');
  const selectedIndex = React.useMemo(() => options.findIndex((option) => option.value === selectedOption), [options, selected]);

  const onSubMenuItemClick = (value: string) => {
    setSelectedOption(value);
    onChange?.(value);
  };

  return (
    <Drawer open={open} width={theme.components.subMenu.width} direction={SlideOutDirection.RIGHT} zIndex={25}>
      <Container>
        {options.map((option, index) => {
          const isSelectedOption = index === selectedIndex;

          return (
            <MenuItem key={index} selected={isSelectedOption} onClick={() => onSubMenuItemClick(option.value)}>
              <TippyTooltip title={option.value} position="right">
                <SvgIcon icon={option.icon} color={isSelectedOption ? '#132144' : '#6e849a'} transition="color" />
              </TippyTooltip>
            </MenuItem>
          );
        })}

        <ActiveIndicator activeIndex={selectedIndex} />
      </Container>
    </Drawer>
  );
};

export default SubMenu;
