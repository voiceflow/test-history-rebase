import { Box, Table, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSTableHighlightedTooltip } from './CMSTableHighlightedTooltip.interface';

export const CMSTableHighlightedTooltip = ({ label, search, caption }: ICMSTableHighlightedTooltip) => {
  return (
    <Tooltip.Overflow
      referenceElement={({ ref, onOpen, onClose }) => {
        const labelNode = (
          <Table.Cell.Text.Highlighted as="span" ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} label={label} search={search} overflow />
        );

        return caption == null ? (
          labelNode
        ) : (
          <Box gap={4} width="100%" overflow="hidden">
            {labelNode}

            <Text as="span" color={Tokens.colors.neutralDark.neutralsDark100}>
              ({caption})
            </Text>
          </Box>
        );
      }}
    >
      {() => (
        <Text variant="caption" breakWord>
          {label}
        </Text>
      )}
    </Tooltip.Overflow>
  );
};
