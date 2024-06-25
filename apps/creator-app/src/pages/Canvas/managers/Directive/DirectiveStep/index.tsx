import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface DirectiveStepProps {
  nodeID: string;
  nextPortID: string;
  palette: HSLShades;
}

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ nodeID, nextPortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Directive"
        portID={nextPortID}
        palette={palette}
        placeholder="Send Alexa Directive"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.Directive, Realtime.NodeData.DirectiveBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => <DirectiveStep nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} palette={palette} />;

export default ConnectedActionStep;
