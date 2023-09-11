import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSTableCellFromNowTooltip } from './CMSTableCellFromNowTooltip.interface';

export const CMSTableCellFromNowTooltip = ({ updatedAt }: ICMSTableCellFromNowTooltip) => {
  return (
    <Table.Cell.FromNow
      date={updatedAt}
      label={({ label }) => (
        <Tooltip.Overflow
          referenceElement={({ ref, onOpen, onClose }) => (
            <Table.Cell.Text ref={ref} label={label} onMouseEnter={onOpen} onMouseLeave={onClose} overflow />
          )}
        >
          {() => <Text breakWord>{label}</Text>}
        </Tooltip.Overflow>
      )}
    />
  );
};
