import React from 'react';

import { Add } from '@/components/InteractiveIcon';
import Section, { SectionVariant } from '@/components/Section';
import { useManager } from '@/hooks';
import { NodeData } from '@/models';

import MappingVariables from './MappingVariables';

export const variableMappingFactory = () => ({ from: null, to: null });

interface MappingSectionProps {
  reverse?: boolean;
  isDividerNested?: boolean;
  data: NodeData<NodeData.Component>;
  items?: { from: string | null; to: string | null }[];
  header: string;
  tooltip: string;
  onChange: (items: { from: string | null; to: string | null }[]) => void;
}

const MappingSection: React.FC<MappingSectionProps> = ({ data, header, items, onChange, reverse, tooltip, isDividerNested }) => {
  const { mapManaged, onAdd } = useManager(items, onChange, { factory: variableMappingFactory });

  const AddMappingButton = <Add onClick={onAdd} />;

  return (
    <Section
      header={header}
      status={AddMappingButton}
      variant={SectionVariant.SUBSECTION}
      tooltip={tooltip}
      dividers
      forceDividers
      isDividerNested={isDividerNested}
    >
      <MappingVariables reverse={reverse} mapManaged={mapManaged} diagramID={data.diagramID} items={items} onChange={onChange} />
    </Section>
  );
};

export default MappingSection;
