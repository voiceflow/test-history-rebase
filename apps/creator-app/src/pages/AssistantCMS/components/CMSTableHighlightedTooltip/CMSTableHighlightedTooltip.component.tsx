import { Table, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSTableHighlightedTooltip } from './CMSTableHighlightedTooltip.interface';

export const CMSTableHighlightedTooltip = ({ label, search }: ICMSTableHighlightedTooltip) => {
  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => (
        <Table.Cell.Text.Highlighted ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} label={label} search={search} overflow />
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
