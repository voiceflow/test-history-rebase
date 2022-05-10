import React from 'react';

import { useManager } from '@/hooks';

import MetaDataLineItem from '../../MetaDataLineItem';
import PrefixVariableInput from '../../PrefixVariableInput';
import LineItemsSection from './LineItemsSection';

function RequestParams({ parameters, onChange, factory }) {
  const { onAdd, mapManaged } = useManager(parameters ?? [], (parameters) => onChange({ parameters }), { factory });

  return (
    <LineItemsSection header="Parameter Assignments" onAdd={onAdd} dividers>
      {mapManaged((param, { key, onRemove, onUpdate }) => (
        <MetaDataLineItem
          prefix="KEY"
          keyPlaceholder="Enter Parameter Key"
          onRemove={onRemove}
          onUpdate={(key) => onUpdate({ key })}
          value={param.key}
          key={key}
        >
          <PrefixVariableInput
            placeholder="Enter value or {variable}"
            value={param.val}
            prefix="VALUE"
            onChange={(newValue) => onUpdate({ val: newValue })}
          />
        </MetaDataLineItem>
      ))}
    </LineItemsSection>
  );
}

export default RequestParams;
