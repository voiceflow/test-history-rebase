import { Base } from '@voiceflow/platform-config';
import { Divider, stopPropagation, useContextApi } from '@voiceflow/ui';
import React from 'react';

import type { SlateEditableRef, SlatePluginsOptions, SlateValue } from '@/components/SlateEditable';
import {
  HyperlinkButton,
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
import type { SlateTextInputProps } from './types';

const SlateTextInput: React.ForwardRefRenderFunction<SlateEditableRef, SlateTextInputProps> = (
  {
    options = Object.values(Base.Project.Chat.ToolbarOption), // all options available by default
    onEmpty,
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
  const variablesOptions = useSlateVariables({
    variables,
    creatable: variablesCreatable,
    withSlots: variablesWithSlots,
  });
  const localPluginsOptions = useContextApi<SlatePluginsOptions>({
    ...pluginsOptions,
    [SlatePluginType.VARIABLES]: variablesOptions,
  });

  const optionsMap = React.useMemo<Partial<Record<Base.Project.Chat.ToolbarOption, true>>>(
    () => Object.fromEntries(options.map((option) => [option, true])),
    [options]
  );

  const emptyRef = React.useRef(false);

  const onChange = (value: SlateValue) => {
    setLocalValue(value);

    if (!onEmpty) return;

    const isEmpty = editor.isEmptyState(value);

    if (isEmpty === emptyRef.current) return;

    emptyRef.current = isEmpty;
    onEmpty(editor.isEmptyState(value));
  };

  useSlateEditorForceNormalize(editor, [variables]);

  return (
    <SlateBaseInput
      {...props}
      ref={ref}
      value={localValue}
      editor={editor}
      onChange={onChange}
      placeholder={placeholder}
      pluginsOptions={localPluginsOptions}
    >
      {!!(options.length || extraToolbarButtons) && (
        <Toolbar onClick={stopPropagation()}>
          {optionsMap.TEXT_BOLD && <TextBoldButton icon={icons.TEXT_BOLD} />}
          {optionsMap.TEXT_ITALIC && <TextItalicButton icon={icons.TEXT_ITALIC} />}
          {optionsMap.TEXT_UNDERLINE && <TextUnderlineButton icon={icons.TEXT_UNDERLINE} />}
          {optionsMap.TEXT_STRIKE_THROUGH && <TextStrikeThroughButton icon={icons.TEXT_STRIKE_THROUGH} />}

          {optionsMap.HYPERLINK && (
            <>
              <Divider height={15} offset={4} isVertical />
              <HyperlinkButton icon={icons.HYPERLINK} />
            </>
          )}

          {extraToolbarButtons}
        </Toolbar>
      )}
    </SlateBaseInput>
  );
};

export default React.forwardRef<SlateEditableRef, SlateTextInputProps>(SlateTextInput);
