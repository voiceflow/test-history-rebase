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
  { onToggle: () => void; onClose: () => void; label: string; activeTooltipLabel?: string | null }
>(({ activeTooltipLabel, label, onClose, onToggle }, ref) => {
  React.useEffect(() => {
    if (activeTooltipLabel && activeTooltipLabel !== label) {
      onClose();
    }
  }, [activeTooltipLabel, label]);

  return (
    <Text ref={ref} color="#1a1e23" onMouseEnter={onToggle} weight="semiBold">
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
    <Box width="100%" justify="space-between" align="center" height="36px">
      <Tooltip
        width={212}
        modifiers={modifiers}
        onOpen={() => setTooltipActiveLabel?.(label)}
        placement="left-start"
        referenceElement={({ onToggle, onClose, ref }) => (
          <KBSettingLabelText ref={ref} onToggle={onToggle} onClose={onClose} label={label} activeTooltipLabel={activeTooltipLabel} />
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
