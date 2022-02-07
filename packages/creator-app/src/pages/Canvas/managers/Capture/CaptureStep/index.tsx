import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoReplyItem, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  nextPortID: string;
  toVariable: Nullable<string>;
  fromVariable: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  variant: BlockVariant;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, nodeID, nextPortID, noReply, noReplyPortID, variant }) => (
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
        variant={variant}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />

      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = ({ ports, data, variant }) => (
  <CaptureStep
    nodeID={data.nodeID}
    noReply={data.noReply}
    toVariable={data.variable}
    nextPortID={ports.out.builtIn[Models.PortType.NEXT]}
    fromVariable={data.slot}
    noReplyPortID={ports.out.builtIn[Models.PortType.NO_REPLY]}
    variant={variant}
  />
);

export default ConnectedCaptureStep;
