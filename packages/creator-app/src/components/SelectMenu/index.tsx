import React from 'react';

import Popper, { PopperContent, PopperProps } from '@/components/Popper';

import { SelectMenuHeader } from './components';

export { MenuSection } from './components';

interface SelectMenuProp extends Omit<PopperProps, 'renderContent'> {
  sections: ({ onToggle }: { onToggle: () => void }) => React.ReactNode;
  clearData: () => void;
  actionDisabled?: boolean;
}

const SelectMenu: React.FC<SelectMenuProp> = ({ children, sections, placement = 'bottom-start', actionDisabled, clearData }) => (
  <Popper
    width="300px"
    placement={placement}
    renderContent={({ onToggle }) => (
      <PopperContent>
        <SelectMenuHeader actionDisabled={actionDisabled} onClear={clearData} title="All filters" />
        {sections({ onToggle })}
      </PopperContent>
    )}
  >
    {children}
  </Popper>
);

export default SelectMenu;
