import { forwardRef, SlateEditor } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import React from 'react';

import useMarkupWithVariables from './MarkupInputWithVariables.hook';
import type { IMarkupInputWithVariables } from './MarkupInputWithVariables.interface';

export const MarkupInputWithVariables = forwardRef<SlateEditorRef, IMarkupInputWithVariables>(
  'MarkupInputWithVariables',
  (
    { value, onBlur, plugins, onFocus, onTouched, autoFocus, placeholder, onValueEmpty, onValueChange, pluginOptions, autoFocusIfEmpty, ...props },
    ref
  ) => {
    const markupWithVariablesProps = useMarkupWithVariables({
      ref,
      value,
      onBlur,
      plugins,
      onFocus,
      onTouched,
      autoFocus,
      placeholder,
      onValueEmpty,
      onValueChange,
      pluginOptions,
      autoFocusIfEmpty,
    });

    return <SlateEditor.Component {...props} {...markupWithVariablesProps} />;
  }
);
