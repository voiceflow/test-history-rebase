import type { PopperTypes } from '@voiceflow/ui';
import { Popper } from '@voiceflow/ui';
import React from 'react';

import { SelectMenuHeader } from './components';

export { MenuSection } from './components';

interface SelectMenuProp extends Omit<PopperTypes.Props, 'renderContent'> {
  onClose?: VoidFunction;
  onClear: VoidFunction;
  sections: ({ onToggle }: { onToggle: VoidFunction }) => React.ReactNode;
  actionDisabled?: boolean;
}

const SelectMenu: React.FC<SelectMenuProp> = ({
  onClose,
  children,
  sections,
  placement = 'bottom-start',
  actionDisabled,
  onClear,
}) => (
  <Popper
    width="300px"
    onClose={onClose}
    placement={placement}
    renderContent={({ onToggle }) => (
      <Popper.Content>
        <SelectMenuHeader actionDisabled={actionDisabled} onClear={onClear} title="All filters" />

        {sections({ onToggle })}
      </Popper.Content>
    )}
  >
    {children}
  </Popper>
);

export default SelectMenu;
