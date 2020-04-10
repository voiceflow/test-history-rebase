import React from 'react';

import { Add } from '@/components/InteractiveIcon';
import Section from '@/components/Section';
import { useManager } from '@/hooks';

import MappingVariables from './MappingVariables';

export const variableMappingFactory = () => ({ from: null, to: null });

function MappingSection({ data, header, items, onChange, reverse, tooltip, isDividerNested }) {
  const { mapManaged, onAdd } = useManager(items, onChange, { factory: variableMappingFactory });

  const AddMappingButton = <Add onClick={onAdd} />;
  return (
    <Section
      header={header}
      status={AddMappingButton}
      variant="subsection"
      tooltip={tooltip}
      dividers
      forceDividers
      isDividerNested={isDividerNested}
    >
      <MappingVariables reverse={reverse} mapManaged={mapManaged} diagramID={data.diagramID} items={items} onChange={onChange} />
    </Section>
  );
}

export default MappingSection;
