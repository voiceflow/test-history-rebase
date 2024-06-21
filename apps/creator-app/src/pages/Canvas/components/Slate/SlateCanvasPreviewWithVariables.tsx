import { SlateEditor } from '@voiceflow/ui-next';
import React from 'react';
import { Descendant } from 'slate';

import { SlateVariablesMapByIDContext } from '../../contexts';

interface SlateCanvasPreviewWithVariablesProps {
  value: Descendant[];
  placeholder?: string;
}

export const SlateCanvasPreviewWithVariables: React.FC<SlateCanvasPreviewWithVariablesProps> = ({
  value,
  placeholder,
}) => {
  const variablesMap = React.useContext(SlateVariablesMapByIDContext)!;

  return (
    <SlateEditor.Preview
      value={value}
      pluginsOptions={{ [SlateEditor.PluginType.VARIABLE]: { variablesMap: variablesMap as any } }}
      placeholder={placeholder}
    />
  );
};
