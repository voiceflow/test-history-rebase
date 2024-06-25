import composeRef from '@seznam/compose-react-refs';
import { Utils } from '@voiceflow/common';
import { Menu, Popper, Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSTableLinkMenuCell } from './CMSTableLinkMenuCell.interface';

export const CMSTableLinkMenuCell = <Item,>({
  label,
  items,
  updates,
  iconName,
  children,
}: ICMSTableLinkMenuCell<Item>): React.ReactElement => {
  return !items.length ? (
    <Table.Cell.Empty />
  ) : (
    <Popper
      placement="bottom-start"
      referenceElement={(popperProps) => (
        <Tooltip.Overflow
          referenceElement={(tooltipProps) => (
            <Table.Cell.Link
              ref={composeRef(tooltipProps.ref, popperProps.ref)}
              label={label}
              updates={updates}
              onClick={Utils.functional.chain(popperProps.onToggle, tooltipProps.onClose)}
              iconName={iconName}
              overflow
              isActive={popperProps.isOpen}
              onMouseEnter={tooltipProps.onOpen}
              onMouseLeave={tooltipProps.onClose}
            />
          )}
        >
          {() => (
            <Text variant="caption" breakWord>
              {label}
            </Text>
          )}
        </Tooltip.Overflow>
      )}
    >
      {() => <Menu onClick={(event) => event.stopPropagation()}>{children({ items })}</Menu>}
    </Popper>
  );
};
