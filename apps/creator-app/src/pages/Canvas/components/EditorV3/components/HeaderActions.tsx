import { Utils } from '@voiceflow/common';
import { SidebarEditorTypes } from '@voiceflow/ui';
import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
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
        <Menu width="fit-content" minWidth={0}>
          {defaultActions.map((action, index) =>
            action ? (
              <>
                <Menu.Item prefixIconName={action.icon} key={index} label={action.label} onClick={Utils.functional.chain(action.onClick, onClose)} />

                {index >= 0 && index < defaultActions.length - 1 && <Menu.Divider />}
              </>
            ) : null
          )}
        </Menu>
      )}
    </Popper>
  );
};
