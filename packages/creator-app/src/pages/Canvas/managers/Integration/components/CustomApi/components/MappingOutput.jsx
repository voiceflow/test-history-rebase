import React from 'react';

import { useMapManager } from '@/hooks';
import PrefixedVariableSelect from '@/pages/Canvas/components/PrefixedVariableSelect';

import MetaDataLineItem from '../../MetaDataLineItem';
import LineItemsSection from './LineItemsSection';

function MappingOutput({ mapping, onChange, factory }) {
  const mapManager = useMapManager(mapping ?? [], (mapping) => onChange({ mapping }), { factory });

  return (
    <LineItemsSection header="Transform into Variables" onAdd={() => mapManager.onAdd()} dividers>
      {mapManager.map((map, { key, onUpdate, onRemove }) => (
        <MetaDataLineItem
          prefix="PATH"
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
