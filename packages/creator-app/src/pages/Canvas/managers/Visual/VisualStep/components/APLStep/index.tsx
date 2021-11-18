import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Display/constants';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export interface APLStepProps {
  image?: string | null;
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
}

export const APLStep: React.FC<APLStepProps> = ({ label, nodeID, image, nextPortID }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Add a multimodal display"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAPLStep: ConnectedStep<Node.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ node, data }) => {
  const label = data.aplType === Node.Visual.APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return <APLStep nodeID={node.id} label={label} image={image} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} />;
};

export default ConnectedAPLStep;
