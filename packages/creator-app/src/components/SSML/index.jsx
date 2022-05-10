import { Utils } from '@voiceflow/common';
import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import cn from 'classnames';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { PluginType } from '@/components/TextEditor';
import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { prettifyGoogleVoicesLong, prettifyVoice, voiceOptionsFilter } from '@/utils/voice';

import { DefaultVoiceContainer, Editor, Speaker, VoiceItem, VoiceSelect } from './components';
import { getPlatformSSML } from './constants';

const pluginsTypes = [PluginType.XML, PluginType.VARIABLES];
const pluginsWithoutVariablesTypes = [PluginType.XML];

const SSML = (
  {
    voice,
    space,
    onBlur,
    locales,
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
    createInputPlaceholder = 'New Variable',
    ...props
  },
  ref
) => {
  const platformSSMLMeta = getPlatformSSML(platform, projectType);
  const wavenetVoices = useFeature(FeatureFlag.WAVENET_VOICES);
  const SSMLPlaceholder = placeholder ?? platformSSMLMeta.fallbackPlaceholder(voice);
  const { canChangeVoice } = platformSSMLMeta;
  const voiceOptions = React.useMemo(() => platformSSMLMeta.voiceOptions(locales, wavenetVoices.isEnabled), [locales, wavenetVoices.isEnabled]);
  const hasProjectLevelVoice = platform === VoiceflowConstants.PlatformType.GOOGLE;

  const voiceSelectLabel = Utils.string.capitalizeFirstLetter(
    hasProjectLevelVoice ? prettifyGoogleVoicesLong(defaultVoice) : prettifyVoice(voice) || 'Select Voice'
  );

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
    [defaultVoice]
  );

  const additionalXMLControlsRenderer = React.useCallback(
    ({ store }) => (
      <>
        <Speaker
          voice={hasProjectLevelVoice ? defaultVoice : voice}
          platform={platform}
          getSSMLToPlay={() => store.getEditorState().getCurrentContent().getPlainText()}
        />

        {canChangeVoice && (
          <Tooltip title={voiceSelectLabel} position="top" delay={300}>
            <VoiceSelect
              label={voiceSelectLabel}
              placeholder="Select Voice"
              inline
              value={null}
              options={voiceOptions}
              onSelect={onChangeVoice}
              minWidth={false}
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
                        title={option?.value === defaultVoice ? 'Remove as Default' : 'Set as Default Voice'}
                        disabled={option?.value === defaultVoice && option?.value === platformDefaultVoice}
                        hideOnClick={false}
                        popperOptions={{ modifiers: { preventOverflow: { enabled: false } } }}
                      >
                        <SvgIcon icon="star" onClick={(e) => onDefaultVoice(option, e)} />
                      </TippyTooltip>
                    </DefaultVoiceContainer>
                  )}
                </VoiceItem>
              )}
            />
          </Tooltip>
        )}
      </>
    ),
    [voice, platform, onChangeVoice, getOptionValue, getOptionLabel, defaultVoice, onChangeDefaultVoice]
  );

  const { platformTags } = platformSSMLMeta;

  const pluginProps = React.useMemo(
    () => ({
      [PluginType.XML]: {
        type: 'ssml',
        tags: platformTags,
        addLabel: 'Add Effect',
        addOptions: platformSSMLMeta.addOptions,
        historyTooltip: 'Recent Effects',
        newLinesAllowed: true,
        tagsSearchPlaceholder: 'effects',
        additionalControlsRenderer: additionalXMLControlsRenderer,
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
    [additionalXMLControlsRenderer, space, variables, creatable, characters, onAddVariable, createInputPlaceholder, withVariablesPlugin, platformTags]
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
