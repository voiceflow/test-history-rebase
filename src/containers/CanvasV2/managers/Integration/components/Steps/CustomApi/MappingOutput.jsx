import React from 'react';

import { useManager } from '@/hooks';

import MetaDataLineItem from '../components/MetaDataLineItem';
import StepContainer from '../components/StepContainer';
import StepContentContainer from '../components/StepContentContainer';
import StepHeader from '../components/StepHeader';
import PrefixedVariableSelect from './components/PrefixedVariableSelect';

function MappingOutput({ data, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(data.mapping, (mapping) => onChange({ mapping }), { factory });

  return (
    <StepContainer>
      <StepHeader>Transform into Variables</StepHeader>
      <StepContentContainer>
        {mapManaged((map, { key, index, onUpdate, onRemove }) => (
          <MetaDataLineItem
            prefix="PATH"
            firstItem={index === 0}
            onlyItem={items.length === 1}
            keyPlaceholder="Enter object path"
            onRemove={onRemove}
            onAdd={onAdd}
            onUpdate={(path) => onUpdate({ path })}
            value={map.path}
            key={key}
          >
            <PrefixedVariableSelect
              value={map.var}
              onChange={(value) => {
                onUpdate({ var: value });
              }}
            />
          </MetaDataLineItem>
        ))}
      </StepContentContainer>
    </StepContainer>
  );
}

export default MappingOutput;
