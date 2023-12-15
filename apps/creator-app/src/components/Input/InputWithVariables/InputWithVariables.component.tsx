import { clsx } from '@voiceflow/style';
import { Box, forwardRef, Input, SlateEditor } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/esm/components/Inputs/SlateEditor';
import React, { useMemo } from 'react';

import { MarkupInputWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables';

import type { IInputWithVariables } from './InputWithVariables.interface';

export const InputWithVariables = forwardRef<SlateEditorRef, IInputWithVariables>('InputWithVariables')(
  (
    {
      error,
      variant = 'primary',
      fullWidth = true,
      className,
      singleLine,
      placeholder = 'Enter text or {variable}',
      canCreateVariables = true,
      ...props
    },
    ref
  ) => {
    const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
      () => ({
        [SlateEditor.PluginType.VARIABLE]: { canCreate: canCreateVariables },
        [SlateEditor.PluginType.SINGLE_LINE]: { nowrap: true },
      }),
      [canCreateVariables]
    );

    return (
      <Box width={fullWidth ? '100%' : 'auto'} className={clsx(Input.css.inputContainer, Input.Theme[variant])}>
        <MarkupInputWithVariables
          {...props}
          ref={ref}
          plugins={singleLine ? [SlateEditor.PluginType.SINGLE_LINE] : undefined}
          className={clsx(Input.css.inputStyleRecipe({ error, variant }), className)}
          placeholder={placeholder}
          pluginOptions={pluginsOptions}
        />
      </Box>
    );
  }
);
