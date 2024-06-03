import { FocusIndicator, forwardRef, SlateEditor } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import React, { useMemo } from 'react';

import { MarkupInputWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables';
import { ALL_URLS_REGEX } from '@/utils/string.util';

import type { IResponseTextInput } from './ResponseTextInput.interface';

export const ResponseTextInput = forwardRef<SlateEditorRef, IResponseTextInput>('ResponseTextInput')((
  {
    toolbar,
    placeholder = { default: 'Enter agent response', focused: '‘{‘ to add variable' },
    canCreateVariables = true,
    ...props
  },
  ref
) => {
  const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
    () => ({
      [SlateEditor.PluginType.LINK]: { regexp: ALL_URLS_REGEX, isURL: (str) => str.match(ALL_URLS_REGEX) !== null },
      [SlateEditor.PluginType.VARIABLE]: { canCreate: canCreateVariables },
    }),
    [canCreateVariables]
  );

  return (
    <MarkupInputWithVariables
      {...props}
      ref={ref}
      header={toolbar}
      plugins={[SlateEditor.PluginType.LINK]}
      placeholder={placeholder}
      pluginOptions={pluginsOptions}
      editableContainer={({ editable }) => (
        <FocusIndicator.Container pl={24} overflow="hidden">
          {editable}
        </FocusIndicator.Container>
      )}
    />
  );
});
