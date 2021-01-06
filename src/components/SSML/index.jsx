import cn from 'classnames';
import React from 'react';

import { defaultLabelRenderer } from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { PluginType } from '@/components/TextEditor';
import TippyTooltip from '@/components/TippyTooltip';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { useFeature } from '@/hooks';
import { ClassName } from '@/styles/constants';
import { stopPropagation } from '@/utils/dom';

import { DefaultVoiceContainer, Editor, Speaker, VoiceItem, VoiceSelect } from './components';
import { PLATFORM_SSML_META, VOICES } from './constants';

export { VOICES };

const pluginsTypes = [PluginType.XML, PluginType.VARIABLES];
const pluginsWithoutVariablesTypes = [PluginType.XML];

const voicesMap = VOICES.flatMap(({ value, label, options }) => [{ value, label }, ...options]).reduce(
  (obj, option) => Object.assign(obj, { [option.value]: option.value ? option.label : '' }),
  {}
);

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
    characters,
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
  const platformSSMLMeta = PLATFORM_SSML_META[platform];
  const ttsVoices = useFeature(FeatureFlag.TTS_VOICES);
  const wavenetVoices = useFeature(FeatureFlag.WAVENET_VOICES);
  const SSMLPlaceholder = placeholder ?? platformSSMLMeta.fallbackPlaceholder(voice);
  let canChangeVoice = platformSSMLMeta.canChangeVoice;
  const voiceOptions = platformSSMLMeta.voiceOptions(locales, wavenetVoices.isEnabled);
  const hasProjectLevelVoice = platform === PlatformType.GOOGLE;

  const handleDefaultVoice = (option) => {
    option?.value === defaultVoice ? stopPropagation(onChangeDefaultVoice(null)) : onChangeDefaultVoice(option?.value ?? null);
  };

  // When removing the ttsVoices FF, update the PLATFORM_SSML_META const to return true for all platforms' canChangeVoice
  if (ttsVoices.isEnabled && platform !== PlatformType.ALEXA) {
    canChangeVoice = true;
  }

  const getOptionValue = React.useCallback((option) => option?.value, []);
  const getOptionLabel = React.useCallback((value) => voicesMap[value], []);

  const additionalXMLControlsRenderer = React.useCallback(
    ({ store }) => (
      <>
        <Speaker
          voice={hasProjectLevelVoice ? defaultVoice : voice}
          platform={platform}
          getSSMLToPlay={() => store.getEditorState().getCurrentContent().getPlainText()}
        />
        {canChangeVoice &&
          (ttsVoices.isEnabled ? (
            <VoiceSelect
              label={hasProjectLevelVoice ? defaultVoice : voice || 'Select Voice'}
              placeholder="Select Voice"
              multiLevelDropdown
              inline
              value={null}
              borderLess
              searchable={true}
              onSelect={(value) => {
                onChangeVoice(value);
              }}
              minWidth={false}
              autoWidth={false}
              createInputPlaceholder="Search Voice"
              options={voiceOptions}
              getOptionValue={(option) => option?.value}
              getOptionLabel={(value) => value}
              renderOptionLabel={(option, ...args) => {
                return (
                  <VoiceItem onClick={() => hasProjectLevelVoice && handleDefaultVoice(option)}>
                    {defaultLabelRenderer(option, ...args)}
                    {withDefaultVoice && !option.options && (
                      <DefaultVoiceContainer active={option?.value === defaultVoice}>
                        <TippyTooltip
                          title={option?.value === defaultVoice ? 'Remove as Default' : 'Set as Default Voice'}
                          disabled={option?.value === defaultVoice && option?.value === platformDefaultVoice}
                          hideOnClick={false}
                          popperOptions={{
                            modifiers: {
                              preventOverflow: { enabled: false },
                            },
                          }}
                        >
                          <SvgIcon icon="star" onClick={() => handleDefaultVoice(option)} />
                        </TippyTooltip>
                      </DefaultVoiceContainer>
                    )}
                  </VoiceItem>
                );
              }}
            />
          ) : (
            <>
              <VoiceSelect
                label={voice}
                inline
                grouped
                options={VOICES}
                minWidth={false}
                onSelect={(value) => onChangeVoice(value)}
                autoWidth={false}
                borderLess
                searchable
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                renderOptionLabel={(option, ...args) => (
                  <VoiceItem>
                    {defaultLabelRenderer(option, ...args)}
                    {withDefaultVoice && (
                      <DefaultVoiceContainer active={option?.value === defaultVoice}>
                        <TippyTooltip
                          title={option?.value === defaultVoice ? 'Remove as Default' : 'Set as Default Voice'}
                          disabled={option?.value === defaultVoice && option?.value === platformDefaultVoice}
                          hideOnClick={false}
                          popperOptions={{
                            modifiers: {
                              preventOverflow: { enabled: false },
                            },
                          }}
                        >
                          <SvgIcon
                            icon="star"
                            onClick={
                              option?.value === defaultVoice
                                ? stopPropagation(() => onChangeDefaultVoice(null))
                                : () => onChangeDefaultVoice(option?.value ?? null)
                            }
                          />
                        </TippyTooltip>
                      </DefaultVoiceContainer>
                    )}
                  </VoiceItem>
                )}
                createInputPlaceholder="Search Voice"
              />
            </>
          ))}
      </>
    ),
    [voice, platform, onChangeVoice, getOptionValue, getOptionLabel, defaultVoice, onChangeDefaultVoice]
  );

  const platformTags = platformSSMLMeta.platformTags;

  const pluginProps = React.useMemo(
    () => ({
      [PluginType.XML]: {
        type: 'ssml',
        tags: platformTags,
        addLabel: 'Add Effect',
        addOptions: platformSSMLMeta.addOptions,
        historyTooltip: 'Recent Effects',
        tagsSearchPlaceholder: 'Search effects',
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

  const onBlurCallback = React.useCallback(({ text }) => onBlur?.({ text }), [onBlur]);

  const onEnterPressCallback = React.useCallback(({ text }) => onEnterPress?.({ text }), [onEnterPress]);

  return (
    <Editor
      {...props}
      className={cn(ClassName.SSML, className)}
      ref={ref}
      onBlur={onBlurCallback}
      placeholder={SSMLPlaceholder}
      onEnterPress={onEnterPress ? onEnterPressCallback : null}
      pluginsTypes={withVariablesPlugin ? pluginsTypes : pluginsWithoutVariablesTypes}
      pluginsProps={pluginProps}
    />
  );
};

export default React.forwardRef(SSML);
