import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, NoReplyItem, Section, VariableLabel } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = ({ ports, data, palette }) => (
  <Step nodeID={data.nodeID}>
    <Section>
      <Item
        label={
          data.slot &&
          data.variable && (
            <>
              Capture <VariableLabel>{`{${data.slot}}`}</VariableLabel> to <VariableLabel>{`{${data.variable}}`}</VariableLabel>
            </>
          )
        }
        icon={NODE_CONFIG.icon}
        portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
        palette={palette}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />

      <NoReplyItem portID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]} noReply={data.noReply} />
    </Section>
  </Step>
);

export default ConnectedCaptureStep;
