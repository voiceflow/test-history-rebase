import { setRef } from '@voiceflow/ui';
import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';
import type {
  TextEditorBlurData,
  TextEditorProps,
  TextEditorRef,
  TextEditorVariable,
  VariablesPluginsData,
} from '@/components/TextEditor/types';

const pluginsTypes = [PluginType.VARIABLES];

export interface UtteranceValue {
  text: string;
  slots: string[];
}

type SaveCallback = (data: UtteranceValue) => void;

export interface UtteranceSlot {
  id: string;
  name: string;
  isVariable?: boolean;
}

export interface UtteranceProps
  extends Omit<TextEditorProps, 'onBlur' | 'onEnterPress' | 'pluginsTypes' | 'pluginsProps'>,
    Omit<VariablesPluginsData, 'variables' | 'onAddVariable' | 'onVariableAdded'> {
  slots: TextEditorVariable[];
  onBlur?: SaveCallback;
  noSlots?: boolean;
  onAddSlot?: VariablesPluginsData['onAddVariable'];
  onEnterPress?: SaveCallback;
}

export interface UtteranceRef extends TextEditorRef {
  getCurrentUtterance: () => UtteranceValue;
}

const Utterance: React.ForwardRefRenderFunction<UtteranceRef, UtteranceProps> = (
  {
    space,
    slots,
    creatable,
    noSlots,
    onAddSlot,
    characters,
    createInputPlaceholder = 'Search entities',
    onBlur,
    onEnterPress,
    ...props
  },
  ref
) => {
  const pluginProps = React.useMemo(
    () => ({
      [PluginType.VARIABLES]: {
        space,
        variables: slots,
        creatable,
        characters,
        onAddVariable: onAddSlot,
        notFoundMessage: 'No entities found.',
        notExistMessage: 'No entities exist.',
        createInputPlaceholder,
      },
    }),
    [space, slots, creatable, onAddSlot, characters, createInputPlaceholder]
  );

  const onBlurCallback = React.useCallback(
    ({ text, pluginsData }: TextEditorBlurData) =>
      onBlur?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onBlur]
  );

  const onEnterPressCallback = React.useCallback(
    ({ text, pluginsData }: TextEditorBlurData) =>
      onEnterPress?.({ text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] }),
    [onEnterPress]
  );

  const onUtteranceRef = React.useCallback(
    (editor: TextEditorRef | null) => {
      if (editor) {
        Object.assign(editor, {
          getCurrentUtterance: () => {
            const { text, pluginsData } = editor.getCurrentValue();

            return { text, slots: pluginsData[PluginType.VARIABLES]?.variables || [] };
          },
        });
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

export default React.forwardRef<UtteranceRef, UtteranceProps>(Utterance);
