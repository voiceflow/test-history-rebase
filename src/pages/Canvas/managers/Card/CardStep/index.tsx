import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

export type CardStepProps = {
  image: string | undefined;
  portID: string;
  title: string;
};

export const CardStep: React.FC<CardStepProps> = ({ title, image, portID }) => (
  <Step image={image}>
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

const ConnectedCardStep: React.FC<ConnectedStepProps<NodeData.Card>> = ({ node, data }) => (
  <CardStep portID={node.ports.out[0]} image={data.largeImage} title={data.title} />
);

export default ConnectedCardStep;
