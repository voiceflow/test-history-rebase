import { Select } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { CHANNEL_SECTIONS, getPlatformOrProjectTypeMeta } from '../../constants';

interface ChannelSelectProps {
  value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | undefined;
  onSelect: (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => void;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({ value, onSelect }) => {
  return (
    <Select
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(value) => (value ? getPlatformOrProjectTypeMeta[value]?.name : '')}
      value={value}
      options={CHANNEL_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select Channel"
    ></Select>
  );
};

export default ChannelSelect;
