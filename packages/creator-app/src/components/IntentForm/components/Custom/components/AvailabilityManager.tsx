import { Toggle } from '@voiceflow/ui';
import React from 'react';

import EditorSection from '@/pages/Canvas/components/EditorSection';

import AvailabilityTooltip from './AvailabilityTooltip';

const AvailabilityManager: React.FC<{ isEnabled: boolean; onChange: () => void }> = ({ isEnabled, onChange }) => {
  return (
    <EditorSection
      namespace="availability"
      prefix={<>Available from other topics?</>}
      tooltip={<AvailabilityTooltip />}
      suffix={<Toggle small checked={isEnabled} onChange={onChange} />}
    />
  );
};

export default AvailabilityManager;
