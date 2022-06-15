import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, NoReplyItem, Section, VariableLabel } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  nextPortID: string;
  toVariable: Nullable<string>;
  fromVariable: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  palette: HSLShades;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ fromVariable, toVariable, nodeID, nextPortID, noReply, noReplyPortID, palette }) => (
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
        palette={palette}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />

      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = ({ ports, data, palette }) => (
  <CaptureStep
    nodeID={data.nodeID}
    noReply={data.noReply}
    toVariable={data.variable}
    nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    fromVariable={data.slot}
    noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
    palette={palette}
  />
);

export default ConnectedCaptureStep;
