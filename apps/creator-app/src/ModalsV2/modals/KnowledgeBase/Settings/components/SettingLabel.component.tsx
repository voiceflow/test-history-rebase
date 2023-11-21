import { Box, Text, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import { openInternalURLInANewTab } from '@/utils/window';

import { valueLabelStyles } from '../Settings.css';

export interface ISettingsLabel {
  label: string;
  value?: number | string;
  tooltipText?: string;
  tooltipLearnMore?: string;
}

export const SettingsLabel: React.FC<ISettingsLabel> = ({ label, value, tooltipText, tooltipLearnMore }) => {
  return (
    <Box width="100%" justify="space-between" align="center" height="36px">
      <Tooltip
        width={212}
        referenceElement={({ onOpen, onClose, ref }) => (
          <Text ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} weight="semiBold">
            {label}
          </Text>
        )}
        placement="left"
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 28],
            },
          },
        ]}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>{tooltipText}</Tooltip.Caption>
            {tooltipLearnMore && <Tooltip.Button onClick={() => openInternalURLInANewTab(tooltipLearnMore)}>Learn</Tooltip.Button>}
          </Box>
        )}
      </Tooltip>
      <Text variant="caption" className={valueLabelStyles}>
        {value}
      </Text>
    </Box>
  );
};
