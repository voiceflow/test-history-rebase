import React from 'react';

import { Section } from '@/containers/CanvasV2/components/BlockEditor';
import FlowSelect from '@/containers/CanvasV2/components/FlowSelect';

function FlowEditor({ data, onChange }) {
  return (
    <Section>
      <FlowSelect data={data} onChange={onChange} withVariables />
    </Section>
  );
}

export default FlowEditor;
