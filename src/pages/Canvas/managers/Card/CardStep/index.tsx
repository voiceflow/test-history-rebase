import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

export type CardStepProps = {
  image: string | null;
  nodeID: string;
  portID: string;
  title: string;
};

export const CardStep: React.FC<CardStepProps> = ({ title, image, nodeID, portID }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        portID={portID}
        label={transformVariablesToReadable(title)}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="logs"
        iconColor="#616c60"
        placeholder="This card has no content"
      />
    </Section>
  </Step>
);

const ConnectedCardStep: React.FC<ConnectedStepProps<NodeData.Card>> = ({ node, data }) => {
  const image = isVariable(data.largeImage) ? null : data.largeImage;

  return <CardStep nodeID={node.id} portID={node.ports.out[0]} image={image} title={data.title} />;
};

export default ConnectedCardStep;
