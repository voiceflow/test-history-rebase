import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Display/constants';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export interface APLStepProps {
  image?: string | null;
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
  variant: BlockVariant;
}

export const APLStep: React.FC<APLStepProps> = ({ label, nodeID, image, nextPortID, variant }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        variant={variant}
        placeholder="Add a multimodal display"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAPLStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, variant }) => {
  const label = data.aplType === BaseNode.Visual.APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return <APLStep nodeID={data.nodeID} label={label} image={image} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} variant={variant} />;
};

export default ConnectedAPLStep;
