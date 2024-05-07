import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { SectionV2, TippyTooltip, Toggle } from '@voiceflow/ui';
import React from 'react';

import { useFeature } from '@/hooks';

interface AvailabilitySectionProps {
  onChange: VoidFunction;
  isEnabled: boolean;
}

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({ isEnabled, onChange }) => {
  const cmsWorkflows = useFeature(FeatureFlag.CMS_WORKFLOWS);

  const title = cmsWorkflows.isEnabled ? 'Available from other workflows?' : 'Available from other topics?';

  return (
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
        <SectionV2.Title>{title}</SectionV2.Title>

        <Toggle size={Toggle.Size.EXTRA_SMALL} checked={isEnabled} />
      </SectionV2.SimpleSection>
    </TippyTooltip>
  );
};

export default AvailabilitySection;
