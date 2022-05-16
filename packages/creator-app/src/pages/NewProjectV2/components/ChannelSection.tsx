import { MenuItemGrouped, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { CHANNEL_OPTIONS, PLATFORM_PROJECT_META_MAP } from '../constants';
import { PlatformAndProjectMeta, PlatformAndProjectMetaType, SupportedPlatformProjectType } from '../types';
import SectionErrorMessage from './SectionErrorMessage';

interface ChannelSectionProps {
  value: SupportedPlatformProjectType | null;
  error: boolean;
  onSelect: (value: SupportedPlatformProjectType) => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ value, onSelect, error }) => {
  const valueMeta = value && PLATFORM_PROJECT_META_MAP[value];

  return (
    <Section
      header="Channel"
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <Select<PlatformAndProjectMeta, MenuItemGrouped<PlatformAndProjectMeta>, PlatformAndProjectMetaType>
        error={error}
        value={value as PlatformAndProjectMetaType}
        prefix={valueMeta?.icon ? <SvgIcon size={16} color={valueMeta.iconColor} icon={valueMeta.icon} /> : undefined}
        grouped
        options={CHANNEL_OPTIONS}
        onSelect={(value) => onSelect(value as SupportedPlatformProjectType)}
        useLayers
        searchable
        placeholder="Select channel"
        getOptionKey={(option) => option.type}
        getOptionValue={(option) => option?.type}
        getOptionLabel={(value) => (value ? PLATFORM_PROJECT_META_MAP[value]?.name : '')}
      />

      {error && <SectionErrorMessage>Channel selection is required</SectionErrorMessage>}
    </Section>
  );
};

export default ChannelSection;
