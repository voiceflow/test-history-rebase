import { Utils } from '@voiceflow/common';
import { Menu, Popper, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { useEditorV3DefaultActions } from './EditorV3.hook';
import type { EditorV3Action } from './EditorV3.interface';

export interface IEditorV3HeaderActions {
  actions?: EditorV3Action[];
}

export const EditorV3HeaderActions: React.FC<IEditorV3HeaderActions> = ({ actions }) => {
  const defaultActions = useEditorV3DefaultActions();

  return (
    <Popper
      placement="bottom"
      disableLayers
      referenceElement={({ onOpen, ref, isOpen }) => (
        <SquareButton size="medium" iconName="More" onClick={onOpen} ref={ref} isActive={isOpen} />
      )}
    >
      {({ onClose }) => (
        <Menu width="fit-content" minWidth={0}>
          {(actions ?? defaultActions).map((action, index) =>
            action ? (
              <>
                <Menu.Item
                  prefixIconName={action.icon}
                  key={index}
                  label={action.label}
                  onClick={Utils.functional.chain(action.onClick, onClose)}
                />

                {index >= 0 && index < defaultActions.length - 1 && <Menu.Divider />}
              </>
            ) : null
          )}
        </Menu>
      )}
    </Popper>
  );
};
