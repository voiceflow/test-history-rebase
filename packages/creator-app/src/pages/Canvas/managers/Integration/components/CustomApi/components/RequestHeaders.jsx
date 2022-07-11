import React from 'react';

import { useMapManager } from '@/hooks';

import MetaDataLineItem from '../../MetaDataLineItem';
import PrefixVariableInput from '../../PrefixVariableInput';
import LineItemsSection from './LineItemsSection';

function RequestHeaders({ headers, onChange, factory }) {
  const mapManager = useMapManager(headers ?? [], (headers) => onChange({ headers }), { factory });

  return (
    <LineItemsSection header="Header Assignments" onAdd={() => mapManager.onAdd()} dividers>
      {mapManager.map((header, { key, onUpdate, onRemove }) => (
        <MetaDataLineItem
          key={key}
          prefix="KEY"
          value={header.key}
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
