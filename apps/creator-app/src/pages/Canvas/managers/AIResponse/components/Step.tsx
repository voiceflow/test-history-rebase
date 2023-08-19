import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

const AIResponseStep: ConnectedStep<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts> = ({ ports, data, palette }) => {
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];
  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];
  const prompt = transformVariablesToReadable(data.prompt ?? '');

  const label = data.mode === BaseUtils.ai.PROMPT_MODE.MEMORY ? 'Respond using memory' : prompt && `"${prompt}"`;

  return (
    <Step nodeID={data.nodeID}>
      <Section v2 withIcon>
        <Item
          v2
          icon={data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE ? 'brain' : 'aiResponse'}
          label={label}
          portID={nextPortID}
          palette={palette}
          placeholder="Enter generative prompt"
          withNewLines
          multilineLabel
          labelLineClamp={100}
        />
        {data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE && <Item v2 nestedWithIcon label="No match" portID={noMatchPortID} />}
      </Section>
    </Step>
  );
};

export default AIResponseStep;
