import { SlateEditor } from '@voiceflow/ui-next';
import React from 'react';

export const variablesMap = {
  id1: {
    id: 'id1',
    kind: 'variable',
    name: 'Credit_score',
    color: '#515A63',
    variant: SlateEditor.VariableElementVariant.VARIABLE,
  },
  id2: {
    id: 'id2',
    kind: 'variable',

    name: 'Credit_card_ID',
    color: '#515A63',
    variant: SlateEditor.VariableElementVariant.VARIABLE,
  },
  id3: {
    id: 'id3',
    kind: 'variable',
    name: 'Last_update',
    color: '#515A63',
    variant: SlateEditor.VariableElementVariant.VARIABLE,
  },
};

export interface IVariableComponent {
  value: string;
  id?: 'id1' | 'id2' | 'id3';
}

export const VariableComponent: React.FC<IVariableComponent> = ({ value, id = 'id1' }) => {
  const editor = SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE]);

  return (
    <SlateEditor.Component
      key={value}
      readOnly
      editor={editor}
      pluginsOptions={{
        [SlateEditor.PluginType.VARIABLE]: { canCreate: false, variablesMap },
      }}
      placeholder="Assign to {var}"
      value={[
        {
          children: [
            {
              type: SlateEditor.ElementType.VARIABLE,
              children: [{ text: value }],
              variableID: id,
              variableVariant: SlateEditor.VariableElementVariant.VARIABLE,
            },
          ],
        },
      ]}
    />
  );
};
