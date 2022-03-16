import { Select } from '@voiceflow/ui';
import React from 'react';

import { CHANNEL_SECTIONS, ChannelType, getChannelMeta } from '../../constants';

interface ChannelSelectProps {
  value: ChannelType | undefined;
  onSelect: (value: ChannelType) => void;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({ value, onSelect }) => {
  return (
    <Select
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(value) => (value ? getChannelMeta[value].name : '')}
      value={value}
      options={CHANNEL_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select Channel"
    ></Select>
  );
};

export default ChannelSelect;
