import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

const AISetStep: ConnectedStep<Realtime.NodeData.AISet, Realtime.NodeData.AISetBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => {
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        <Item
          v2
          icon="aiSet"
          label={data.label}
          portID={nextPortID}
          palette={palette}
          placeholder="Add set AI label"
          withNewLines
          multilineLabel
          labelLineClamp={100}
        />
      </Section>
    </Step>
  );
};

export default AISetStep;
