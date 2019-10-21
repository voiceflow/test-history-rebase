import React from 'react';

import ExistingFlow from './components/ExistingFlow';
import SelectFlow from './components/SelectFlow';

function FlowSelect({ data, onChange, withVariables }) {
  return data.diagramID ? (
    <ExistingFlow data={data} onChange={onChange} withVariables={withVariables} />
  ) : (
    <SelectFlow data={data} onChange={onChange} />
  );
}

export default FlowSelect;
