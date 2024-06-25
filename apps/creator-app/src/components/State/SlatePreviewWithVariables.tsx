import { SlateEditor } from '@voiceflow/ui-next';
import React from 'react';
import type { Descendant } from 'slate';

import { Designer } from '@/ducks';
import { useSelector } from '@/hooks';

interface SlatePreviewWithVariablesProps {
  value: Descendant[];
  placeholder?: string;
}

export const SlatePreviewWithVariables: React.FC<SlatePreviewWithVariablesProps> = ({ value, placeholder }) => {
  const variablesMap = useSelector(Designer.selectors.slateVariablesMapByID);

  return (
    <SlateEditor.Preview
      value={value}
      pluginsOptions={{ [SlateEditor.PluginType.VARIABLE]: { variablesMap } }}
      placeholder={placeholder}
    />
  );
};
