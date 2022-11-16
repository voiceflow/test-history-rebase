import { MenuItemGrouped, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useIsFeatureEnabled } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Channel } from '../constants';
import * as Upcoming from '../constants/upcoming';
import SectionErrorMessage from './SectionErrorMessage';

export type ChannelValue = Pick<Channel.Option, 'type' | 'platform'>;

interface ChannelSectionProps {
  value: null | ChannelValue;
  error: string;
  onSelect: (value: null | ChannelValue) => void;
}

const ChannelSection: React.FC<ChannelSectionProps> = ({ error, value, onSelect }) => {
  const platformConfig = Channel.getConfig(value?.platform);
  const typeConfig = value && platformConfig?.types[value.type];

  const isFeatureEnabled = useIsFeatureEnabled();

  const options = React.useMemo(
    () =>
      Channel.OPTIONS.map((group) => ({
        ...group,
        options: group.options?.filter(
          (option) =>
            !option.featureFlag ||
            (Upcoming.Config.isSupported(option.platform) ? !isFeatureEnabled(option.featureFlag) : isFeatureEnabled(option.featureFlag))
        ),
      })),
    []
  );

  return (
    <Section
      header="Channel"
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <Select<Channel.Option, MenuItemGrouped<Channel.Option>, string>
        id={Identifier.PROJECT_CREATE_SELECT_CHANNEL}
        error={!!error}
        value={value && Channel.getID(value)}
        prefix={
          platformConfig?.oneClickPublish && typeConfig ? (
            <SvgIcon size={16} icon={typeConfig.logo ?? typeConfig.icon.name} color={typeConfig.icon.color} />
          ) : undefined
        }
        grouped
        options={options}
        onSelect={(value) => onSelect(value ? Channel.OPTIONS_MAP[value] : null)}
        useLayers
        clearable
        searchable
        placeholder="Select channel"
        getOptionKey={(option) => option.id}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => (value ? Channel.OPTIONS_MAP[value]?.name : '')}
        clearOnSelectActive
      />

      {error && <SectionErrorMessage>{error}</SectionErrorMessage>}
    </Section>
  );
};

export default ChannelSection;
