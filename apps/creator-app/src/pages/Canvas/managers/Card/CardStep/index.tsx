import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface CardStepProps {
  image: string | null;
  title: string;
  nodeID: string;
  nextPortID: string;
  palette: HSLShades;
}

export const CardStep: React.FC<CardStepProps> = ({ title, image, nodeID, nextPortID, palette }) => (
  <Step nodeID={nodeID} image={image}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={transformVariablesToReadable(title)}
        portID={nextPortID}
        palette={palette}
        placeholder="This card has no content"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedCardStep: ConnectedStep<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = ({ ports, data, palette }) => {
  const image = isVariable(data.largeImage) ? null : data.largeImage;

  return (
    <CardStep image={image} title={data.title} nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} palette={palette} />
  );
};

export default ConnectedCardStep;
