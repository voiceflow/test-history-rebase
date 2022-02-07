import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface DirectiveStepProps {
  nodeID: string;
  nextPortID: string;
  variant: BlockVariant;
}

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ nodeID, nextPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Directive"
        portID={nextPortID}
        variant={variant}
        placeholder="Send Alexa Directive"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.Directive, Realtime.NodeData.DirectiveBuiltInPorts> = ({ ports, data, variant }) => (
  <DirectiveStep nodeID={data.nodeID} nextPortID={ports.out.builtIn[Models.PortType.NEXT]} variant={variant} />
);

export default ConnectedActionStep;
