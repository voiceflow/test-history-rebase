import React from 'react';

import MappingSection from './components/MappingSection';

function Mapping({ data, updateInputs, updateOutputs }) {
  return (
    <>
      <MappingSection
        data={data}
        items={data.inputs}
        header="Input Mapping"
        tooltip="Pass in variables that will be used exclusively for this flow."
        onChange={updateInputs}
      />

      <MappingSection
        reverse
        data={data}
        items={data.outputs}
        header="Output Mapping"
        tooltip="Retrieve variables that are used in this flow."
        onChange={updateOutputs}
        isDividerNested
      />
    </>
  );
}

export default Mapping;
