import React from 'react';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';
import FlowSelect from '@/containers/CanvasV2/components/FlowSelect';
import { EngineContext } from '@/containers/CanvasV2/contexts';

function FlowEditor({ data, onChange }) {
  const engine = React.useContext(EngineContext);

  const updateData = (data) => {
    onChange(data);
    engine.node.redraw(data.nodeID);
  };

  return (
    <Section>
      <FlowSelect data={data} onChange={updateData} withVariables />
    </Section>
  );
}

export default FlowEditor;
