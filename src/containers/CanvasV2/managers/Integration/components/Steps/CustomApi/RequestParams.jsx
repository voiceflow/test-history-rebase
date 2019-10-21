import React from 'react';

import { useManager } from '@/hooks';

import MetaDataLineItem from '../components/MetaDataLineItem';
import PrefixVariableInput from '../components/PrefixVariableInput';
import StepContainer from '../components/StepContainer';
import StepContentContainer from '../components/StepContentContainer';

function RequestParams({ data, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(data.parameters, (parameters) => onChange({ parameters }), { factory });

  return (
    <StepContainer>
      <StepContentContainer>
        {mapManaged((param, { key, index, onRemove, onUpdate }) => (
          <MetaDataLineItem
            prefix="KEY"
            firstItem={index === 0}
            onlyItem={items.length === 1}
            keyPlaceholder="Enter Parameter Key"
            onRemove={onRemove}
            onAdd={onAdd}
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
      </StepContentContainer>
    </StepContainer>
  );
}

export default RequestParams;
