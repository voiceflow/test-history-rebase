import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

export type ReminderStepProps = {
  label: string;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
};

export const ReminderStep: React.FC<ReminderStepProps> = ({ label, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="reminder" iconColor="#c998a4" label={label} labelVariant={StepLabelVariant.SECONDARY} placeholder="Set a reminder" />
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

const ConnectedReminderStep: React.FC<ConnectedStepProps<NodeData.Reminder>> = ({ node, data, withPorts }) => {
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
