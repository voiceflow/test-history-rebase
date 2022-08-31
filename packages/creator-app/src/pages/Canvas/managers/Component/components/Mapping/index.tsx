import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import MappingSection from './components/MappingSection';

interface MappingProps {
  data: Realtime.NodeData<Realtime.NodeData.Component>;
  updateInputs: (inputs: Realtime.NodeData.VariableMapping[]) => void;
  updateOutputs: (outputs: Realtime.NodeData.VariableMapping[]) => void;
}

const Mapping: React.FC<MappingProps> = ({ data, updateInputs, updateOutputs }) => (
  <>
    <MappingSection
      data={data}
      items={data.inputs}
      header="Input Mapping"
      tooltip="Pass in variables that will be used exclusively for this component."
      onChange={updateInputs}
    />

    <MappingSection
      data={data}
      items={data.outputs}
      header="Output Mapping"
      reverse
      tooltip="Retrieve variables that are used in this component."
      onChange={updateOutputs}
      isDividerNested
    />
  </>
);

export default Mapping;
