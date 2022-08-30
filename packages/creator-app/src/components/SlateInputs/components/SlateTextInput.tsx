import { Divider, stopPropagation, useContextApi } from '@voiceflow/ui';
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

import { TOOLBAR_ICONS } from '../constants';
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
    icons = TOOLBAR_ICONS,
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
        <TextBoldButton icon={icons.TEXT_BOLD} />
        <TextItalicButton icon={icons.TEXT_ITALIC} />
        <TextUnderlineButton icon={icons.TEXT_UNDERLINE} />
        <TextStrikeThroughButton icon={icons.TEXT_STRIKE_THROUGH} />

        <Divider height={15} offset={4} isVertical />

        <HyperlinkButton icon={icons.HYPERLINK} />

        {extraToolbarButtons}
      </Toolbar>
    </SlateBaseInput>
  );
};

export default React.forwardRef<SlateEditableRef, SlateTextInputProps>(SlateTextInput);
