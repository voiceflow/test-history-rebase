import cn from 'classnames';
import React from 'react';

import { defaultLabelRenderer } from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { PluginType } from '@/components/TextEditor';
import { ClassName } from '@/styles/constants';

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
    onChangeDefaultVoice,
    createInputPlaceholder = 'New Variable',
    ...props
  },
  ref
) => {
  const platformSSMLMeta = PLATFORM_SSML_META[platform];
  const SSMLPlaceholder = placeholder ?? platformSSMLMeta.fallbackPlaceholder(voice);
  const canChangeVoice = platformSSMLMeta.canChangeVoice;

  const getOptionValue = React.useCallback((option) => option?.value, []);
  const getOptionLabel = React.useCallback((value) => voicesMap[value], []);

  const additionalXMLControlsRenderer = React.useCallback(
    ({ store }) => (
      <>
        <Speaker voice={voice} getSSMLToPlay={() => store.getEditorState().getCurrentContent().getPlainText()} />
        {canChangeVoice && (
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
                  <DefaultVoiceContainer active={option?.value === defaultVoice} onClick={() => onChangeDefaultVoice(option?.value ?? null)}>
                    <SvgIcon icon="star" />
                  </DefaultVoiceContainer>
                )}
              </VoiceItem>
            )}
            createInputPlaceholder="Search Voice"
          />
        )}
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
