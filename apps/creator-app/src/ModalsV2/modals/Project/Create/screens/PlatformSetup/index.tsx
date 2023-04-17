import * as Platform from '@voiceflow/platform-config';
import { Box, Button, defaultMenuLabelRenderer, MenuItemGrouped, Modal, SectionV2, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import { useIsFeatureEnabled } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Upcoming } from '../../constants';
import { Channel } from './constants';

interface PlatformSetupProps {
  type: null | Platform.Constants.ProjectType;
  onNext: VoidFunction;
  onClose: VoidFunction;
  locales: string[];
  platform: null | Platform.Constants.PlatformType;
  onChangeLocales: (locales: string[]) => void;
  onChangePlatform: (options: {
    nlu: Platform.Constants.NLUType | null;
    type: Platform.Constants.ProjectType | null;
    platform: Platform.Constants.PlatformType | null;
  }) => void;
}

const PlatformSetup: React.FC<PlatformSetupProps> = ({ type, onNext: onNextProp, onClose, locales, platform, onChangeLocales, onChangePlatform }) => {
  const projectConfig = Platform.Config.getTypeConfig({ type, platform });

  const [error, setError] = React.useState('');

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

  const onSelectPlatform = (value: null | string) => {
    const option = value ? Channel.OPTIONS_MAP[value] : null;

    if (option && Platform.Config.isSupported(option.platform)) {
      onChangePlatform({
        nlu: Platform.Config.get(option.platform).supportedNLUs[0],
        type: option.type,
        platform: option.platform,
      });
    } else {
      onChangePlatform({ nlu: null, type: null, platform: null });
    }

    setError('');
  };

  const onNext = () => {
    if (!type || !platform) {
      setError('Channel selection required');
      return;
    }

    onNextProp();
  };

  return (
    <>
      <Modal.Body>
        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Channel
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <Select<Channel.Option, MenuItemGrouped<Channel.Option>, string>
            id={Identifier.PROJECT_CREATE_SELECT_CHANNEL}
            error={!!error}
            value={type && platform && Channel.getID({ type, platform })}
            prefix={
              platform ? <SvgIcon size={16} icon={projectConfig.logo ?? projectConfig.icon.name} color={projectConfig.icon.color} /> : undefined
            }
            grouped
            options={options}
            onSelect={onSelectPlatform}
            useLayers
            clearable
            searchable
            placeholder="Select channel"
            getOptionKey={(option) => option.id}
            getOptionValue={(option) => option?.id}
            getOptionLabel={(value) => (value ? Channel.OPTIONS_MAP[value]?.name : '')}
            clearOnSelectActive
            renderOptionLabel={(option, ...args) => (
              <Box.Flex gap={16}>
                <SvgIcon size={16} icon={option.icon} color={option.iconColor} />
                {defaultMenuLabelRenderer(option, ...args)}
              </Box.Flex>
            )}
          />

          {error && <SectionV2.ErrorMessage>{error}</SectionV2.ErrorMessage>}
        </SectionV2.SimpleContentSection>

        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              {projectConfig.project.locale.name}
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <LocalesSelect type={type} platform={platform} locales={locales} onChange={onChangeLocales} />
        </SectionV2.SimpleContentSection>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button onClick={() => onNext()}>Continue</Button>
      </Modal.Footer>
    </>
  );
};

export default PlatformSetup;
