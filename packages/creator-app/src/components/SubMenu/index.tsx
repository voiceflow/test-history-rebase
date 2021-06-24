import { Icon, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { PrototypeMode } from '@/ducks/prototype/types';
import { useTheme } from '@/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import Drawer from '../Drawer';
import { ActiveIndicator, Container, MenuItem } from './components';

export type SubMenuItem = {
  icon: Icon;
  value: PrototypeMode;
  label?: string;
  id?: string;
};

export type SubMenuProps = {
  open: boolean;
  options: SubMenuItem[];
  selected?: string;
  onChange?: (value: string) => void;
};

const SubMenu: React.FC<SubMenuProps> = ({ open, options, selected, onChange }) => {
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = React.useState(selected || options?.[0].value || '');
  const selectedIndex = React.useMemo(() => options.findIndex((option) => option.value === selectedOption), [options, selected]);

  const onSubMenuItemClick = (value: string) => {
    setSelectedOption(value);
    onChange?.(value);
  };

  return (
    <Drawer as="section" open={open} width={theme.components.subMenu.width} direction={SlideOutDirection.RIGHT} zIndex={25}>
      <Container>
        {options.map((option, index) => {
          const isSelectedOption = index === selectedIndex;

          return (
            <MenuItem id={option.id} key={index} selected={isSelectedOption} onClick={() => onSubMenuItemClick(option.value)}>
              <TippyTooltip title={option.label || option.value} position="right">
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
