import { SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

interface AvailabilitySectionProps {
  onChange: VoidFunction;
  isEnabled: boolean;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ isEnabled, onChange }) => (
  <TippyTooltip
    width={208}
    content={
      <TippyTooltip.Multiline>
        <TippyTooltip.Title>{isEnabled ? 'Enabled' : 'Disabled'}</TippyTooltip.Title>
        {isEnabled
          ? "When toggled on, this intent acts as 'Global', meaning it can be triggered from anywhere in the assistant."
          : "When toggled off, this intent acts as 'Local', meaning it can only be triggered if the user is actively in this topic."}
      </TippyTooltip.Multiline>
    }
    offset={[-16, -10]}
    display="block"
    placement="bottom-end"
  >
    <SectionV2.SimpleSection onClick={onChange}>
      <SectionV2.Title>Available from other topics?</SectionV2.Title>

      <Toggle size={Toggle.Size.EXTRA_SMALL} checked={isEnabled} />
    </SectionV2.SimpleSection>
  </TippyTooltip>
);

export default AvailabilitySection;
