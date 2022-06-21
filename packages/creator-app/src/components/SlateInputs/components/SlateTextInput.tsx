import { Box, stopPropagation, useContextApi } from '@voiceflow/ui';
import React from 'react';

import {
  HyperlinkButton,
  SlateEditableRef,
  SlatePluginsOptions,
  SlatePluginType,
  TextBoldButton,
  TextItalicButton,
  TextStrikeThroughButton,
  TextUnderlineButton,
  useSetupSlateEditor,
  useSlateEditorForceNormalize,
} from '@/components/SlateEditable';

import { useSlateLocalValue, useSlateVariables } from '../hooks';
import SlateBaseInput from './SlateBaseInput';
import Toolbar from './Toolbar';
import { SlateTextInputProps } from './types';

const SlateTextInput: React.ForwardRefRenderFunction<SlateEditableRef, SlateTextInputProps> = (
  {
    variables,
    placeholder = 'Enter text reply, {} to add variables',
    pluginsOptions,
    variablesCreatable = true,
    variablesWithSlots,
    extraToolbarButtons,
    ...props
  },
  ref
) => {
  const editor = useSetupSlateEditor(SlatePluginType.LINKS, SlatePluginType.VARIABLES);
  const [localValue, setLocalValue] = useSlateLocalValue(props.value, props.onChange);
  const variablesOptions = useSlateVariables({ variables, creatable: variablesCreatable, withSlots: variablesWithSlots });
  const localPluginsOptions = useContextApi<SlatePluginsOptions>({
    ...pluginsOptions,
    [SlatePluginType.VARIABLES]: variablesOptions,
  });

  useSlateEditorForceNormalize(editor, [variables]);

  return (
    <SlateBaseInput
      {...props}
      ref={ref}
      value={localValue}
      editor={editor}
      onChange={setLocalValue}
      placeholder={placeholder}
      pluginsOptions={localPluginsOptions}
    >
      <Toolbar onClick={stopPropagation()}>
        <TextBoldButton />
        <TextItalicButton />
        <TextUnderlineButton />
        <TextStrikeThroughButton />

        <Box width="1px" height="15px" backgroundColor="#dfe3ed" />

        <HyperlinkButton />

        {extraToolbarButtons}
      </Toolbar>
    </SlateBaseInput>
  );
};

export default React.forwardRef<SlateEditableRef, SlateTextInputProps>(SlateTextInput);
