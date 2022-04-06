import React from 'react';

import Popper, { PopperContent, PopperProps } from '@/components/Popper';

import { SelectMenuHeader } from './components';

export { MenuSection } from './components';

interface SelectMenuProp extends Omit<PopperProps, 'renderContent'> {
  onClose?: VoidFunction;
  onClear: VoidFunction;
  sections: ({ onToggle }: { onToggle: VoidFunction }) => React.ReactNode;
  actionDisabled?: boolean;
}

const SelectMenu: React.FC<SelectMenuProp> = ({ onClose, children, sections, placement = 'bottom-start', actionDisabled, onClear }) => (
  <Popper
    width="300px"
    onClose={onClose}
    placement={placement}
    renderContent={({ onToggle }) => (
      <PopperContent>
        <SelectMenuHeader actionDisabled={actionDisabled} onClear={onClear} title="All filters" />

        {sections({ onToggle })}
      </PopperContent>
    )}
  >
    {children}
  </Popper>
);

export default SelectMenu;
