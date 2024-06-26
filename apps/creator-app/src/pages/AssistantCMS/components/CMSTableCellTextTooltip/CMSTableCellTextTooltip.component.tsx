import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSTableCellTextTooltip } from './CMSTableCellTextTooltip.interface';

export const CMSTableCellTextTooltip = ({ label }: ICMSTableCellTextTooltip) => {
  return (
    <Tooltip.Overflow
      getWidth={(node) => Math.max(node.offsetWidth, 200)}
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} label={label} overflow />
      )}
    >
      {() => (
        <Text variant="caption" breakWord>
          {label}
        </Text>
      )}
    </Tooltip.Overflow>
  );
};
