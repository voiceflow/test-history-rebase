import { Utils } from '@voiceflow/common';
import { SidebarEditorTypes } from '@voiceflow/ui';
import { Menu, MenuItem, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { useEditorV3DefaultActions } from '../hooks';

interface HeaderActionsProps extends Partial<Omit<SidebarEditorTypes.HeaderProps, 'title'>> {
  title?: string;
  onBack?: VoidFunction;
  actions?: SidebarEditorTypes.Action[];
}

export const HeaderActions: React.FC<HeaderActionsProps> = () => {
  const defaultActions = useEditorV3DefaultActions();

  return (
    <Popper
      placement="bottom"
      referenceElement={({ onOpen, ref, isOpen }) => <SquareButton size="medium" iconName="More" onClick={onOpen} ref={ref} isActive={isOpen} />}
      disableLayers
    >
      {({ onClose }) => (
        <Menu width={140}>
          {defaultActions.map((action) =>
            action ? (
              <MenuItem
                prefixIconName={action.icon}
                key={action.label}
                label={action.label}
                onClick={Utils.functional.chain(action.onClick, onClose)}
              />
            ) : null
          )}
        </Menu>
      )}
    </Popper>
  );
};
