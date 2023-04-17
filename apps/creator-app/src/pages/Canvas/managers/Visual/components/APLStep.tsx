import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

const APLStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const label = data.aplType === BaseNode.Visual.APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return (
    <Step nodeID={data.nodeID} image={image}>
      <Section>
        <Item
          icon="blocks"
          label={label}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          placeholder="Add a multimodal display"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

export default APLStep;
