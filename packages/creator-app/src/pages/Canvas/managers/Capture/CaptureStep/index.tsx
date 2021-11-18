import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  nextPortID: string;
  toVariable: string | null;
  fromVariable: string | null;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, nodeID, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={
          fromVariable &&
          toVariable && (
            <>
              Capture <VariableLabel>{`{${fromVariable}}`}</VariableLabel> to <VariableLabel>{`{${toVariable}}`}</VariableLabel>
            </>
          )
        }
        icon={NODE_CONFIG.icon}
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = ({ data, node }) => (
  <CaptureStep nodeID={data.nodeID} fromVariable={data.slot} toVariable={data.variable} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} />
);

export default ConnectedCaptureStep;
