import React from 'react';

import { PluginType } from '@/components/TextEditor';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';

import { Editor, Speaker, VoiceSelect } from './components';
import { ALEXA_ADD_OPTIONS, ALEXA_DEFAULT_TAGS, DEFAULT_VOICE, GOOGLE_DEFAULT_TAGS, UNIVERSAL_ADD_OPTIONS, VOICES } from './constants';

export { VOICES, DEFAULT_VOICE };

const pluginsTypes = [PluginType.XML, PluginType.VARIABLES];
const pluginsWithoutVariablesTypes = [PluginType.XML];

const voicesMap = VOICES.flatMap(({ value, label, options }) => [{ value, label }, ...options]).reduce(
  (obj, option) => Object.assign(obj, { [option.value]: option.label }),
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
    isAlexa,
    placeholder = isAlexa ? 'Enter what Alexa will say' : 'Enter what Google will say',
    onEnterPress,
    onChangeVoice,
    onAddVariable,
    withVariablesPlugin = true,
    createInputPlaceholder = 'New Variable',
    ...props
  },
  ref
) => {
  const getOptionValue = React.useCallback((option) => option?.value, []);
  const getOptionLabel = React.useCallback((value) => voicesMap[value], []);

  const additionalXMLControlsRenderer = React.useCallback(
    ({ store }) => (
      <>
        <Speaker
          voice={voice}
          getSSMLToPlay={() =>
            store
              .getEditorState()
              .getCurrentContent()
              .getPlainText()
          }
        />
        {isAlexa && (
          <VoiceSelect
            value={voice}
            inline
            grouped
            options={VOICES}
            minWidth={false}
            onSelect={(value) => onChangeVoice(value)}
            autoWidth={false}
            borderLess
            searchable
            placeholder="Alexa"
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
          />
        )}
      </>
    ),
    [voice, onChangeVoice, getOptionValue, getOptionLabel]
  );

  const platformTags = isAlexa ? ALEXA_DEFAULT_TAGS : GOOGLE_DEFAULT_TAGS;
  const addOptions = isAlexa ? ALEXA_ADD_OPTIONS : UNIVERSAL_ADD_OPTIONS;

  const pluginProps = React.useMemo(
    () => ({
      [PluginType.XML]: {
        type: 'ssml',
        tags: platformTags,
        addLabel: 'Add Effect',
        addOptions,
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
      ref={ref}
      onBlur={onBlurCallback}
      placeholder={placeholder}
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

export default connect(
  mapStateToProps,
  null,
  mergeProps
)(React.forwardRef(SSML));
