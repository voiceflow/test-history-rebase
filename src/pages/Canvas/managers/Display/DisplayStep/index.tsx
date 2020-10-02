import React from 'react';

import { DisplayType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export type DisplayStepProps = {
  image?: string | null;
  label?: string | null;
  portID?: string;
};

export const DisplayStep: React.FC<DisplayStepProps> = ({ label, portID, image }) => (
  <Step image={image}>
    <Section>
      <Item
        label={label}
        portID={portID}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="blocks"
        iconColor="#3c6997"
        placeholder="Add a multimodal display"
      />
    </Section>
  </Step>
);

const ConnectedDisplayStep: React.FC<ConnectedStepProps<NodeData.Display>> = ({ node, data }) => {
  const label = data.displayType === DisplayType.SPLASH ? transformVariablesToReadable(data.splashHeader) : data.jsonFileName;
  const image = isVariable(data.backgroundImage) ? null : data.backgroundImage;

  return <DisplayStep portID={node.ports.out[0]} label={label} image={image} />;
};

export default ConnectedDisplayStep;
