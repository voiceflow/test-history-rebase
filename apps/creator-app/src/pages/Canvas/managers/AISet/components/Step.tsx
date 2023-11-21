import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

const AISetStep: ConnectedStep<Realtime.NodeData.AISet, Realtime.NodeData.AISetBuiltInPorts> = ({ ports, data, palette }) => {
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];

  // TODO: KB_STEP_DEPRECATION
  const isDeprecated = data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE && data.overrideParams === undefined;

  return (
    <Step nodeID={data.nodeID}>
      <Section v2>
        <Item
          v2
          icon={isDeprecated ? 'warning' : 'aiSet'}
          label={data.label}
          portID={nextPortID}
          palette={isDeprecated ? ({ 600: '#BD425F' } as any) : palette}
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
