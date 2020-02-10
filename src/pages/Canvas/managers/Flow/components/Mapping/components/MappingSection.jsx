import React from 'react';

import AddMinusButton from '@/components/AddMinusButton';
import Section from '@/components/Section';
import { useManager } from '@/hooks';

import MappingVariables from './MappingVariables';

export const variableMappingFactory = () => ({ from: null, to: null });

function MappingSection({ data, header, items, onChange, reverse, tooltip }) {
  const { mapManaged, onAdd } = useManager(items, onChange, { factory: variableMappingFactory });

  const AddMappingButton = <AddMinusButton type="add" onClick={onAdd} />;
  return (
    <Section variant="tertiary" header={header} status={AddMappingButton} tooltip={tooltip}>
      <MappingVariables reverse={reverse} mapManaged={mapManaged} diagramID={data.diagramID} items={items} onChange={onChange} />
    </Section>
  );
}

export default MappingSection;
