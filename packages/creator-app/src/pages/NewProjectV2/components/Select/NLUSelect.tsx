import { Select, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getPlatformOrProjectTypeMeta, NLU_SECTIONS } from '../../constants';

interface NLUSelectProps {
  value?: VoiceflowConstants.PlatformType;
  onSelect: (value: VoiceflowConstants.PlatformType) => void;
}

const getPrefixIcon = (value?: VoiceflowConstants.PlatformType) =>
  value && getPlatformOrProjectTypeMeta[value]?.icon ? <SvgIcon size={16} icon={getPlatformOrProjectTypeMeta[value]!.icon!} /> : <></>;

const NLUSelect: React.FC<NLUSelectProps> = ({ value, onSelect }) => {
  return (
    <Select
      prefix={getPrefixIcon(value)}
      grouped
      getOptionValue={(option) => option?.type as any}
      getOptionLabel={(option) => (option ? getPlatformOrProjectTypeMeta[option]?.name : '')}
      value={value}
      options={NLU_SECTIONS as any[]}
      onSelect={onSelect}
      placeholder="Select NLU"
      searchable
    />
  );
};

export default NLUSelect;
