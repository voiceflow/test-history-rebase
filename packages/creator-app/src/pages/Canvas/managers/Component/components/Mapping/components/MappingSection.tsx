import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Add } from '@/components/InteractiveIcon';
import Section, { SectionVariant } from '@/components/Section';
import { useMapManager } from '@/hooks';

import MappingVariables from './MappingVariables';

export const variableMappingFactory = (): Realtime.NodeData.VariableMapping => ({ from: null, to: null });

interface MappingSectionProps {
  data: Realtime.NodeData<Realtime.NodeData.Component>;
  items?: Realtime.NodeData.VariableMapping[];
  header: string;
  tooltip: string;
  onChange: (items: Realtime.NodeData.VariableMapping[]) => void;
  reverse?: boolean;
  isDividerNested?: boolean;
}

const MappingSection: React.FC<MappingSectionProps> = ({ data, header, items = [], onChange, reverse, tooltip, isDividerNested }) => {
  const mapManager = useMapManager(items, onChange, { factory: variableMappingFactory });

  return (
    <Section
      header={header}
      status={<Add onClick={() => mapManager.onAdd()} />}
      variant={SectionVariant.SUBSECTION}
      tooltip={tooltip}
      dividers
      forceDividers
      isDividerNested={isDividerNested}
    >
      <MappingVariables reverse={reverse} mapManaged={mapManager.map} diagramID={data.diagramID} items={items} onChange={onChange} />
    </Section>
  );
};

export default MappingSection;
