import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Box, OverflowText, Select, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { PluginType } from '@/components/TextEditor';
import * as VersionV2 from '@/ducks/versionV2';
import { useHasPremiumVoice, useSelector } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { isAzureVoiceOption, prettifyGoogleVoicesLong, prettifyVoice, voiceOptionsFilter } from '@/utils/voice';

import { DefaultVoiceContainer, Editor, Speaker, VoiceItem, VoiceSelectTrigger } from './components';
import { getPlatformSSML } from './constants';

const pluginsTypes = [PluginType.XML, PluginType.VARIABLES];
const pluginsWithoutVariablesTypes = [PluginType.XML];

const SSML = (
  {
    voice,
    space,
    onBlur,
    platform,
    creatable,
    className,
    variables,
    autofocus,
    characters,
    projectType,
    placeholder,
    defaultVoice,
    onEnterPress,
    onChangeVoice,
    onAddVariable,
    withDefaultVoice = true,
    withVariablesPlugin = true,
    platformDefaultVoice,
    onChangeDefaultVoice,
    createInputPlaceholder = 'Search variables',
    ...props
  },
  ref
) => {
  const { hasPremiumVoice } = useHasPremiumVoice();
  const locales = useSelector(VersionV2.active.localesSelector);

  const platformSSMLMeta = getPlatformSSML(platform, projectType);
  const SSMLPlaceholder = placeholder ?? platformSSMLMeta.fallbackPlaceholder(voice);
  const { canChangeVoice } = platformSSMLMeta;
  const voiceOptions = React.useMemo(() => platformSSMLMeta.voiceOptions(locales, hasPremiumVoice), []);
  const hasProjectLevelVoice = platform === Platform.Constants.PlatformType.GOOGLE;

  const voiceSelectLabel = Utils.string.capitalizeFirstLetter(
    hasProjectLevelVoice ? prettifyGoogleVoicesLong(defaultVoice) : prettifyVoice(voice) || 'Select Voice'
  );

  const isMicrosoftVoice = isAzureVoiceOption(voice);

  const getOptionValue = React.useCallback((option) => option?.value, []);
  const getOptionLabel = React.useCallback((value) => value, []);

  const onDefaultVoice = React.useCallback(
    (option, event) => {
      if (option.options?.length) {
        return;
      }

      if (option?.value === defaultVoice) {
        event?.stopPropagation();
        onChangeDefaultVoice(null);
      } else {
        onChangeDefaultVoice(option?.value ?? null);
      }
    },
    [defaultVoice, onChangeDefaultVoice]
  );

  const additionalXMLControlsRenderer = React.useCallback(
    ({ store }) => (
      <Box.Flex ml={-6} gap={8}>
        <Speaker
          voice={hasProjectLevelVoice ? defaultVoice : voice}
          platform={platform}
          getSSMLToPlay={() => store.getEditorState().getCurrentContent().getPlainText()}
        />

        {canChangeVoice && (
          <Select
            label={voiceSelectLabel}
            placeholder="Select Voice"
            inline
            value={null}
            options={voiceOptions}
            onSelect={onChangeVoice}
            minWidth={false}
            maxWidth={240}
            useLayers
            autoWidth={false}
            borderLess
            isMultiLevel
            optionsFilter={voiceOptionsFilter}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            renderOptionLabel={(option) => (
              <VoiceItem onClick={(e) => hasProjectLevelVoice && onDefaultVoice(option, e)}>
                {option.label || option.value}

                {withDefaultVoice && !option.options && (
                  <DefaultVoiceContainer active={option?.value === defaultVoice}>
                    <TippyTooltip
                      content={option?.value === defaultVoice ? 'Remove as Default' : 'Set as Default Voice'}
                      disabled={option?.value === defaultVoice && option?.value === platformDefaultVoice}
                      hideOnClick={false}
                    >
                      <SvgIcon icon="star" onClick={(e) => onDefaultVoice(option, e)} />
                    </TippyTooltip>
                  </DefaultVoiceContainer>
                )}
              </VoiceItem>
            )}
            renderTrigger={({ ref, onOpenMenu, onHideMenu, isOpen }) => (
              <TippyTooltip content={voiceSelectLabel} placement="top" delay={300} offset={[0, 0]}>
                <VoiceSelectTrigger ref={ref} isActive={isOpen} onClick={isOpen ? onHideMenu : onOpenMenu}>
                  <OverflowText>{voiceSelectLabel || 'Select Voice'}</OverflowText>
                  <SvgIcon icon="arrowToggleV2" color="#6e849a" size={20} rotation={90} />
                </VoiceSelectTrigger>
              </TippyTooltip>
            )}
          />
        )}
      </Box.Flex>
    ),
    [voice, platform, onChangeVoice, getOptionValue, getOptionLabel, defaultVoice, onDefaultVoice]
  );

  const { platformTags } = platformSSMLMeta;

  const pluginProps = React.useMemo(
    () => ({
      [PluginType.XML]: {
        type: 'ssml',
        tags: platformTags,
        icon: 'systemShootingStar',
        addLabel: isMicrosoftVoice ? 'Effects aren’t supported for this voice.' : 'Add effect',
        addOptions: platformSSMLMeta.addOptions,
        newLinesAllowed: true,
        tagsSearchPlaceholder: 'effects',
        additionalControlsRenderer: additionalXMLControlsRenderer,
        disabled: isMicrosoftVoice,
      },
      [withVariablesPlugin ? PluginType.VARIABLES : null]: {
        space,
        variables,
        creatable,
        characters,
        onAddVariable,
        suggestOnSelection: false,
        createInputPlaceholder,
      },
    }),
    [
      additionalXMLControlsRenderer,
      space,
      variables,
      creatable,
      characters,
      onAddVariable,
      createInputPlaceholder,
      withVariablesPlugin,
      platformTags,
    ]
  );

  const onBlurCallback = React.useCallback(
    ({ text, pluginsData }) => onBlur?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onBlur]
  );

  const onEnterPressCallback = React.useCallback(
    ({ text, pluginsData }) => onEnterPress?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onEnterPress]
  );

  return (
    <Editor
      {...props}
      ref={ref}
      onBlur={onBlurCallback}
      className={cn(ClassName.SSML, className)}
      placeholder={SSMLPlaceholder}
      onEnterPress={onEnterPress ? onEnterPressCallback : null}
      pluginsTypes={withVariablesPlugin ? pluginsTypes : pluginsWithoutVariablesTypes}
      pluginsProps={pluginProps}
      newLineOnShiftEnter
    />
  );
};

export default React.forwardRef(SSML);
