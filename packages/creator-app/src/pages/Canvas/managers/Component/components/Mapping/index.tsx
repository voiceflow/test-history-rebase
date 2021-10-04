import React from 'react';

import { NodeData } from '@/models';

import MappingSection from './components/MappingSection';

interface MappingProps {
  isFlow?: boolean;
  data: NodeData<NodeData.Component>;
  updateInputs: (inputs: { from: string | null; to: string | null }[]) => void;
  updateOutputs: (outputs: { from: string | null; to: string | null }[]) => void;
}

const Mapping: React.FC<MappingProps> = ({ isFlow, data, updateInputs, updateOutputs }) => (
  <>
    <MappingSection
      data={data}
      items={data.inputs}
      header="Input Mapping"
      tooltip={`Pass in variables that will be used exclusively for this ${isFlow ? 'flow' : 'component'}.`}
      onChange={updateInputs}
    />

    <MappingSection
      reverse
      isDividerNested
      data={data}
      items={data.outputs}
      header="Output Mapping"
      tooltip={`Retrieve variables that are used in this ${isFlow ? 'flow' : 'component'}.`}
      onChange={updateOutputs}
    />
  </>
);

export default Mapping;
