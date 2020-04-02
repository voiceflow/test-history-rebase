import React from 'react';

import { DisplayType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

export type DisplayStepProps = {
  image?: string;
  label?: string;
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

export type ConnectedDisplayStepProps = ConnectedStepProps<NodeData.Display> & {
  variables: string[];
};

const ConnectedDisplayStep: React.FC<ConnectedDisplayStepProps> = ({ node, data }) => {
  const label = data.displayType === DisplayType.SPLASH ? transformVariablesToReadable(data.splashHeader) : data.jsonFileName;

  return <DisplayStep portID={node.ports.out[0]} label={label} image={data.backgroundImage} />;
};

export default ConnectedDisplayStep;
