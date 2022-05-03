import { Select, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { CHANNEL_SECTIONS, getPlatformOrProjectTypeMeta } from '../../constants';

interface ChannelSelectProps {
  value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | undefined;
  onSelect: (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => void;
  error: boolean;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({ value, onSelect, error }) => {
  const getPrefixIcon = (value?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) =>
    value && getPlatformOrProjectTypeMeta[value]?.icon ? (
      <SvgIcon size={16} color={getPlatformOrProjectTypeMeta[value]?.iconColor} icon={getPlatformOrProjectTypeMeta[value]!.icon!} />
    ) : undefined;
  return (
    <Select
      prefix={getPrefixIcon(value)}
      error={error}
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(value) => (value ? getPlatformOrProjectTypeMeta[value]?.name : '')}
      value={value}
      options={CHANNEL_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select channel"
      searchable
      inputStopProp={false}
    ></Select>
  );
};

export default ChannelSelect;
