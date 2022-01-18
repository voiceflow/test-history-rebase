import { setRef } from '@voiceflow/ui';
import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';

const pluginsTypes = [PluginType.VARIABLES];

const Utterance = (
  { space, slots, creatable, noSlots, onAddSlot, characters, createInputPlaceholder = 'New Entity', onBlur, onEnterPress, ...props },
  ref
) => {
  const pluginProps = React.useMemo(
    () => ({
      [PluginType.VARIABLES]: { space, variables: slots, creatable, characters, onAddVariable: onAddSlot, createInputPlaceholder },
    }),
    [space, slots, creatable, onAddSlot, characters, createInputPlaceholder]
  );

  const onBlurCallback = React.useCallback(
    ({ text, pluginsData }) => onBlur?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onBlur]
  );

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

      setRef(ref, editor);
    },
    [ref]
  );

  return (
    <TextEditor
      {...props}
      ref={onUtteranceRef}
      onBlur={onBlurCallback}
      onEnterPress={onEnterPressCallback}
      pluginsTypes={!noSlots ? pluginsTypes : []}
      pluginsProps={!noSlots ? pluginProps : {}}
    />
  );
};

export default React.forwardRef(Utterance);
