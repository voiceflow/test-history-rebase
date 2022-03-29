import { Select, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { isAlexaPlatform } from '@/utils/typeGuards';

import { CHANNEL_SECTIONS, getPlatformOrProjectTypeMeta } from '../../constants';

interface ChannelSelectProps {
  value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType | undefined;
  onSelect: (value: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) => void;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({ value, onSelect }) => {
  const getPrefixIcon = (value?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType) =>
    value && getPlatformOrProjectTypeMeta[value]?.icon ? (
      <SvgIcon color={isAlexaPlatform(value) ? '#5fcaf4' : ''} icon={getPlatformOrProjectTypeMeta[value]!.icon!} />
    ) : (
      <></>
    );

  return (
    <Select
      prefix={getPrefixIcon(value)}
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(value) => (value ? getPlatformOrProjectTypeMeta[value]?.name : '')}
      value={value}
      options={CHANNEL_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select Channel"
      searchable
    ></Select>
  );
};

export default ChannelSelect;
