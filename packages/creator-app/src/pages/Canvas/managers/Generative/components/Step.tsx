import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

const GenerateStep: ConnectedStep<Realtime.NodeData.Generative, Realtime.NodeData.GenerativeBuiltInPorts> = ({ ports, data, palette }) => {
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        <Item
          v2
          icon="ai"
          label={transformVariablesToReadable(data.prompt ?? '')}
          portID={nextPortID}
          palette={palette}
          placeholder="Enter generative prompt"
          withNewLines
          multilineLabel
          labelLineClamp={100}
        />
      </Section>
    </Step>
  );
};

export default GenerateStep;
