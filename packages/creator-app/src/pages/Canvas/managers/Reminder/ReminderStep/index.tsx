import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface ReminderStepProps {
  label: string;
  nodeID: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  variant: BlockVariant;
}

export const ReminderStep: React.FC<ReminderStepProps> = ({ label, withPorts, nodeID, successPortID, failurePortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} label={label} variant={variant} placeholder="Set a reminder" labelVariant={StepLabelVariant.SECONDARY} />
    </Section>
    <Section>
      {withPorts && (
        <>
          <SuccessItem label="Success" portID={successPortID} />
          <FailureItem label="No Access" portID={failurePortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedReminderStep: ConnectedStep<Realtime.NodeData.Reminder, Realtime.NodeData.ReminderBuiltInPorts> = ({
  node,
  data,
  withPorts,
  variant,
}) => (
  <ReminderStep
    label={transformVariablesToReadable(data.text)}
    nodeID={node.id}
    withPorts={withPorts}
    successPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    failurePortID={node.ports.out.builtIn[Models.PortType.FAIL]}
    variant={variant}
  />
);

export default ConnectedReminderStep;
