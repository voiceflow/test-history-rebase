import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Display/constants';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export interface APLStepProps {
  image?: string | null;
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
  palette: HSLShades;
}

export const APLStep: React.FC<APLStepProps> = ({ label, nodeID, image, nextPortID, palette }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        palette={palette}
        placeholder="Add a multimodal display"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAPLStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ ports, data, palette }) => {
  const label = data.aplType === BaseNode.Visual.APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return <APLStep nodeID={data.nodeID} label={label} image={image} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} palette={palette} />;
};

export default ConnectedAPLStep;
