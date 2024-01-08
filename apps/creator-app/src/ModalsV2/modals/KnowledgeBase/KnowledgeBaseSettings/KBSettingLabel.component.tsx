import { Box, Text, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { openInternalURLInANewTab } from '@/utils/window';

import { valueLabelStyles } from './KnowledgeBaseSettings.css';

export interface IKBSettingLabel {
  label: string;
  value?: number | string;
  tooltipText?: string;
  tooltipLearnMore?: string;
  activeTooltipLabel?: string | null;
  setTooltipActiveLabel?: React.Dispatch<React.SetStateAction<string | null>>;
}

export const KBSettingLabelText = React.forwardRef<
  HTMLParagraphElement,
  {
    label: string;
    activeTooltipLabel?: string | null;
    onOpen: () => void;
    onClose: () => void;
  }
>(({ activeTooltipLabel, label, onClose, onOpen }, ref) => {
  React.useEffect(() => {
    if (activeTooltipLabel !== label) {
      onClose();
    }
  }, [activeTooltipLabel, label]);

  return (
    <Text color="#1a1e23" weight="semiBold" ref={ref} onMouseEnter={onOpen}>
      {label}
    </Text>
  );
});

export const KBSettingLabel: React.FC<IKBSettingLabel> = ({
  label,
  value,
  tooltipText,
  tooltipLearnMore,
  activeTooltipLabel,
  setTooltipActiveLabel,
}) => {
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [-10, 28] } }]);

  return (
    <Box width="100%" justify="space-between" align="center" height="36px" pl={24} onMouseLeave={() => setTooltipActiveLabel?.(null)}>
      <Tooltip
        width={212}
        modifiers={modifiers}
        onOpen={() => setTooltipActiveLabel?.(label)}
        placement="left-start"
        referenceElement={({ onOpen, onClose, ref }) => (
          <KBSettingLabelText ref={ref} onOpen={onOpen} onClose={onClose} label={label} activeTooltipLabel={activeTooltipLabel} />
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
