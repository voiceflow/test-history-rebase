import React from 'react';

import { NodeData } from '@/models';

import MappingSection from './components/MappingSection';

interface MappingProps {
  isFlow?: boolean;
  data: NodeData<NodeData.Component>;
  updateInputs: (inputs: NodeData.VariableMapping[]) => void;
  updateOutputs: (outputs: NodeData.VariableMapping[]) => void;
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
      data={data}
      items={data.outputs}
      header="Output Mapping"
      tooltip={`Retrieve variables that are used in this ${isFlow ? 'flow' : 'component'}.`}
      onChange={updateOutputs}
      isDividerNested
    />
  </>
);

export default Mapping;
