import { APLStepData, APLType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Display/constants';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export type APLStepProps = {
  image?: string | null;
  label?: string | null;
  nodeID: string;
  portID?: string;
};

export const APLStep: React.FC<APLStepProps> = ({ label, nodeID, portID, image }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={portID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Add a multimodal display"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAPLStep: React.FC<ConnectedStepProps<APLStepData>> = ({ node, data }) => {
  const label = data.aplType === APLType.SPLASH ? transformVariablesToReadable(data.title) : data.jsonFileName;
  const image = isVariable(data.imageURL) ? null : data.imageURL;

  return <APLStep nodeID={node.id} portID={node.ports.out[0]} label={label} image={image} />;
};

export default ConnectedAPLStep;
