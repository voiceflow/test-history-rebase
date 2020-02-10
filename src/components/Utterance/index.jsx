import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';

const pluginsTypes = [PluginType.VARIABLES];

const Utterance = (
  { space, slots, creatable, onAddSlot, characters, createInputPlaceholder = 'New Slot', onBlur, onEnterPress, ...props },
  forwardedRef
) => {
  const pluginProps = React.useMemo(
    () => ({
      [PluginType.VARIABLES]: { space, variables: slots, creatable, characters, onAddVariable: onAddSlot, createInputPlaceholder },
    }),
    [space, slots, creatable, onAddSlot, characters, createInputPlaceholder]
  );

  const onBlurCallback = React.useCallback(({ text, pluginsData }) => onBlur?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }), [
    onBlur,
  ]);

  const onEnterPressCallback = React.useCallback(
    ({ text, pluginsData }) => onEnterPress?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onEnterPress]
  );

  const onUtteranceRef = React.useCallback(
    (editor) => {
      if (editor) {
        editor.getCurrentUtterance = () => {
          const { text, pluginsData } = editor.getCurrentValue();
          return { text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] };
        };
      }
      if (forwardedRef) {
        forwardedRef.current = editor;
      }
    },
    [forwardedRef]
  );

  return (
    <TextEditor
      {...props}
      ref={onUtteranceRef}
      onBlur={onBlurCallback}
      onEnterPress={onEnterPressCallback}
      pluginsTypes={pluginsTypes}
      pluginsProps={pluginProps}
    />
  );
};

export default React.forwardRef(Utterance);
