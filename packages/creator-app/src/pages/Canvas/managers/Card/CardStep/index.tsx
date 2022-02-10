import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface CardStepProps {
  image: string | null;
  title: string;
  nodeID: string;
  nextPortID: string;
  variant: BlockVariant;
}

export const CardStep: React.FC<CardStepProps> = ({ title, image, nodeID, nextPortID, variant }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={transformVariablesToReadable(title)}
        portID={nextPortID}
        variant={variant}
        placeholder="This card has no content"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedCardStep: ConnectedStep<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = ({ ports, data, variant }) => {
  const image = isVariable(data.largeImage) ? null : data.largeImage;

  return (
    <CardStep image={image} title={data.title} nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} variant={variant} />
  );
};

export default ConnectedCardStep;
