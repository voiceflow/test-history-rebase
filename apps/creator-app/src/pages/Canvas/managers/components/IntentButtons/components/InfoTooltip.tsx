import { Tooltip } from '@voiceflow/ui';
import React from 'react';

interface InfoTooltipProps {
  label: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ label }) => (
  <>
    <Tooltip.Title>{label}</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
      Add {label.toLowerCase()} to the end of your messages in conversations to allow users to quickly trigger intents.
    </Tooltip.Section>
  </>
);

export default InfoTooltip;
