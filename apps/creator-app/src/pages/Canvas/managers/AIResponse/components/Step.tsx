import { BaseModels, BaseUtils } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

const AIResponseStep: ConnectedStep<Realtime.NodeData.AIResponse, Realtime.NodeData.AIResponseBuiltInPorts> = ({ ports, data, palette }) => {
  const nextPortID = ports.out.builtIn[BaseModels.PortType.NEXT];
  const notFoundPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];
  const prompt = transformVariablesToReadable(data.prompt ?? '');

  const isKnowledgeBaseSource = data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE;

  const label = data.mode === BaseUtils.ai.PROMPT_MODE.MEMORY ? 'Respond using memory' : prompt && `"${prompt}"`;
  const icon = isKnowledgeBaseSource ? 'brain' : 'aiResponse';

  // TODO: KB_STEP_DEPRECATION
  const isDeprecated = data.source === BaseUtils.ai.DATA_SOURCE.KNOWLEDGE_BASE && data.overrideParams === undefined;

  return (
    <Step nodeID={data.nodeID}>
      <Section v2 withIcon>
        <Item
          v2
          icon={isDeprecated ? 'warning' : icon}
          label={label}
          portID={nextPortID}
          palette={isDeprecated ? ({ 600: '#BD425F' } as any) : palette}
          placeholder={isKnowledgeBaseSource ? 'Enter query' : 'Enter generative prompt'}
          withNewLines
          multilineLabel
          labelLineClamp={100}
        />
        {data.notFoundPath && isKnowledgeBaseSource && <Item nestedWithIcon v2 label="Not found" portID={notFoundPortID} palette={palette} />}
      </Section>
    </Step>
  );
};

export default AIResponseStep;
