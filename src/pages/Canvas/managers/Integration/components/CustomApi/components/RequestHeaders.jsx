import React from 'react';

import { useManager } from '@/hooks';

import MetaDataLineItem from '../../MetaDataLineItem';
import PrefixVariableInput from '../../PrefixVariableInput';
import LineItemsSection from './LineItemsSection';

function RequestHeaders({ headers, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(headers, (headers) => onChange({ headers }), { factory });

  return (
    <LineItemsSection header="Header Assignments" onAdd={onAdd} dividers>
      {mapManaged((header, { key, onUpdate, onRemove }) => (
        <MetaDataLineItem
          key={key}
          prefix="KEY"
          value={header.key}
          onlyItem={items.length === 1}
          onRemove={onRemove}
          onUpdate={(key) => onUpdate({ key })}
          keyPlaceholder="Enter HTTP Header"
        >
          <PrefixVariableInput
            value={header.val}
            prefix="VALUE"
            onChange={(newValue) => onUpdate({ val: newValue })}
            placeholder="Enter value or {variable}"
          />
        </MetaDataLineItem>
      ))}
    </LineItemsSection>
  );
}

export default RequestHeaders;
