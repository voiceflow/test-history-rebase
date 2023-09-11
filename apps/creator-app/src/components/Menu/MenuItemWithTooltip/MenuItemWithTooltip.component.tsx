import { Utils } from '@voiceflow/common';
import { MenuItem, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { usePopperModifiers } from '@/hooks/popper.hook';
import { popperPaddingModifierFactory } from '@/utils/popper.util';

import type { IMenuItemWithTooltip } from './MenuItemWithTooltip.interface';

export const MenuItemWithTooltip: React.FC<IMenuItemWithTooltip> = ({ tooltip, children, ...props }) => {
  const modifiers = usePopperModifiers([popperPaddingModifierFactory({ padding: 3 })]);

  return (
    <Tooltip
      {...tooltip}
      inline
      modifiers={tooltip?.modifiers ?? modifiers}
      placement={tooltip?.placement ?? 'left-start'}
      referenceElement={({ ref, popper, onOpen, onClose }) => (
        <MenuItem
          {...props}
          ref={ref}
          onClick={Utils.functional.chain(props.onClick, onClose)}
          onMouseEnter={Utils.functional.chain(props.onMouseEnter, onOpen)}
          onMouseLeave={Utils.functional.chain(props.onMouseLeave, onClose)}
        >
          {popper}
        </MenuItem>
      )}
    >
      {children}
    </Tooltip>
  );
};
