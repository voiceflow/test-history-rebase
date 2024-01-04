import { Box, Text, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { openInternalURLInANewTab } from '@/utils/window';

import { valueLabelStyles } from './KnowledgeBaseSettings.css';

export interface IKBSettingLabel {
  label: string;
  value?: number | string;
  tooltipText?: string;
  tooltipLearnMore?: string;
}

export const KBSettingLabel: React.FC<IKBSettingLabel> = ({ label, value, tooltipText, tooltipLearnMore }) => {
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 28] } }]);

  return (
    <Box width="100%" justify="space-between" align="center" height="36px">
      <Tooltip
        width={212}
        modifiers={modifiers}
        placement="left-start"
        // hasArrowShift
        referenceElement={({ onToggle, ref }) => (
          <Text ref={ref} color="#1a1e23" onMouseEnter={onToggle} weight="semiBold">
            {label}
          </Text>
        )}
      >
        {() => (
          <Box direction="column">
            <Tooltip.Caption>{tooltipText}</Tooltip.Caption>
            {tooltipLearnMore && <Tooltip.Button onClick={() => openInternalURLInANewTab(tooltipLearnMore)}>Learn</Tooltip.Button>}
          </Box>
        )}
      </Tooltip>

      {value && (
        <Text variant="caption" className={valueLabelStyles}>
          {value}
        </Text>
      )}
    </Box>
  );
};
