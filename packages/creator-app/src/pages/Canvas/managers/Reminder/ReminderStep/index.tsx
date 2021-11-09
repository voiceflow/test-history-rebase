import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface ReminderStepProps {
  label: string;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
}

export const ReminderStep: React.FC<ReminderStepProps> = ({ label, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Set a reminder"
        labelVariant={StepLabelVariant.SECONDARY}
      />
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

const ConnectedReminderStep: React.FC<ConnectedStepProps<Realtime.NodeData.Reminder>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return (
    <ReminderStep
      label={transformVariablesToReadable(data.text)}
      nodeID={node.id}
      successPortID={successPortID}
      failurePortID={failurePortID}
      withPorts={withPorts}
    />
  );
};

export default ConnectedReminderStep;
