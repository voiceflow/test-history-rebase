import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface DirectiveStepProps {
  nodeID: string;
  nextPortID: string;
}

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ nodeID, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Directive"
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Send Alexa Directive"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.Directive, Realtime.NodeData.DirectiveBuiltInPorts> = ({ node }) => (
  <DirectiveStep nodeID={node.id} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} />
);

export default ConnectedActionStep;
