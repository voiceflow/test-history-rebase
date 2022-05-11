import { Select, SvgIcon } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { getPlatformOrProjectTypeMeta, NLU_SECTIONS } from '../../constants';

interface NLUSelectProps {
  value?: VoiceflowConstants.PlatformType;
  onSelect: (value: VoiceflowConstants.PlatformType) => void;
  error: boolean;
  isImportLoading: boolean;
}

const getPrefixIcon = (isImportLoading: boolean, value?: VoiceflowConstants.PlatformType) => {
  if (isImportLoading) {
    return <SvgIcon size={16} icon="sync" spin />;
  }
  return value && getPlatformOrProjectTypeMeta[value]?.icon ? (
    <SvgIcon size={16} color={getPlatformOrProjectTypeMeta[value]?.iconColor} icon={getPlatformOrProjectTypeMeta[value]!.icon!} />
  ) : undefined;
};

const NLUSelect: React.FC<NLUSelectProps> = ({ value, onSelect, error, isImportLoading }) => {
  return (
    <Select
      prefix={getPrefixIcon(isImportLoading, value)}
      grouped
      error={error}
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
