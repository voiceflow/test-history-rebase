import cn from 'classnames';
import React from 'react';

import { PluginType } from '@/components/TextEditor';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ClassName } from '@/styles/constants';

import { Editor, Speaker, VoiceSelect } from './components';
import { DEFAULT_VOICE, PLATFORM_SSML_META, VOICES } from './constants';

export { VOICES, DEFAULT_VOICE };

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
    creatable,
    variables,
    characters,
    placeholder,
    onEnterPress,
    onChangeVoice,
    onAddVariable,
    withVariablesPlugin = true,
    createInputPlaceholder = 'New Variable',
    platform,
    className,
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
            createInputPlaceholder="Search Voice"
          />
        )}
      </>
    ),
    [voice, onChangeVoice, getOptionValue, getOptionLabel]
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

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

const mergeProps = ({ platform = PlatformType.ALEXA }) => ({ isAlexa: platform === PlatformType.ALEXA });

export default connect(mapStateToProps, null, mergeProps)(React.forwardRef(SSML));
