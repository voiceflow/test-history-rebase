import { clsx } from '@voiceflow/style';
import { Box, forwardRef, Input, SlateEditor } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/esm/components/Inputs/SlateEditor';
import React, { useMemo } from 'react';

import { MarkupInputWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables';
import { stopImmediatePropagation } from '@/utils/handler.util';

import type { IInputWithVariables } from './InputWithVariables.interface';

export const InputWithVariables = forwardRef<SlateEditorRef, IInputWithVariables>('InputWithVariables')((
  {
    error,
    inputVariant = 'primary',
    fullWidth = true,
    className,
    singleLine,
    placeholder = 'Enter text or {variable}',
    canCreateVariables = true,
    variablesMap,
    onVariableClick,
    maxVariableWidth = '100px',
    resetBaseStyles = false,
    ...props
  },
  ref
) => {
  const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
    () => ({
      [SlateEditor.PluginType.VARIABLE]: {
        canEdit: true,
        canCreate: canCreateVariables,
        variablesMap,
        maxVariableWidth,
      },
      [SlateEditor.PluginType.SINGLE_LINE]: { nowrap: true },
    }),
    [canCreateVariables, variablesMap]
  );

  return (
    <Box width={fullWidth ? '100%' : 'auto'} className={clsx(Input.css.inputContainer, Input.Theme[inputVariant])}>
      <MarkupInputWithVariables
        {...props}
        ref={ref}
        onPaste={stopImmediatePropagation()}
        plugins={singleLine ? [SlateEditor.PluginType.SINGLE_LINE] : undefined}
        className={clsx(
          resetBaseStyles ? undefined : Input.css.inputStyleRecipe({ error, variant: inputVariant }),
          className
        )}
        placeholder={placeholder}
        pluginOptions={pluginsOptions}
      />
    </Box>
  );
});
