import React from 'react';

import PrefixedVariableSelect from '@/containers/CanvasV2/components/PrefixedVariableSelect';
import { useManager } from '@/hooks';

import MetaDataLineItem from '../../MetaDataLineItem';
import LineItemsSection from './LineItemsSection';

function MappingOutput({ mapping, onChange, factory }) {
  const { items, onAdd, mapManaged } = useManager(mapping, (mapping) => onChange({ mapping }), { factory });

  return (
    <LineItemsSection header="Transform into Variables" onAdd={onAdd} dividers>
      {mapManaged((map, { key, onUpdate, onRemove }) => (
        <MetaDataLineItem
          prefix="PATH"
          onlyItem={items.length === 1}
          keyPlaceholder="Enter object path"
          onRemove={onRemove}
          onUpdate={(path) => onUpdate({ path })}
          value={map.path}
          key={key}
        >
          <PrefixedVariableSelect value={map.var} onChange={(value) => onUpdate({ var: value })} />
        </MetaDataLineItem>
      ))}
    </LineItemsSection>
  );
}

export default MappingOutput;
