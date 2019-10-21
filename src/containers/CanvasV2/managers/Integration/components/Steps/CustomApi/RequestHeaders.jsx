import React from 'react';

import { useManager } from '@/hooks';

import MetaDataLineItem from '../components/MetaDataLineItem';
import PrefixVariableInput from '../components/PrefixVariableInput';
import StepContainer from '../components/StepContainer';
import StepContentContainer from '../components/StepContentContainer';

function RequestHeaders({ data, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(data.headers, (headers) => onChange({ headers }), { factory });

  return (
    <StepContainer>
      <StepContentContainer>
        {mapManaged((header, { key, index, onUpdate, onRemove }) => (
          <MetaDataLineItem
            prefix="KEY"
            firstItem={index === 0}
            onlyItem={items.length === 1}
            keyPlaceholder="Enter HTTP Header"
            onRemove={onRemove}
            onAdd={onAdd}
            onUpdate={(key) => onUpdate({ key })}
            value={header.key}
            key={key}
          >
            <PrefixVariableInput
              placeholder="Enter value or {variable}"
              value={header.val}
              prefix="VALUE"
              onChange={(newValue) => {
                onUpdate({ val: newValue });
              }}
            />
          </MetaDataLineItem>
        ))}
      </StepContentContainer>
    </StepContainer>
  );
}

export default RequestHeaders;
