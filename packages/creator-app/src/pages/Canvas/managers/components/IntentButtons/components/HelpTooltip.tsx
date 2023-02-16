import { Tooltip } from '@voiceflow/ui';
import React from 'react';

interface HowItWorksProps {
  label: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ label }) => (
  <Tooltip.Section marginBottomUnits={2}>
    Add {label.toLowerCase()} to the end of your messages in conversations to allow users to quickly trigger intents.
  </Tooltip.Section>
);

export default HowItWorks;
