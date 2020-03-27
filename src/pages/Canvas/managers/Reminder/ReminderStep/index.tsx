import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

export type ReminderStepProps = {
  label: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
};

export const ReminderStep: React.FC<ReminderStepProps> = ({ label, withPorts, successPortID, failurePortID }) => (
  <Step>
    <Section>
      <Item icon="clock" iconColor="#c998a4" label={label} labelVariant={StepLabelVariant.SECONDARY} placeholder="Set a reminder" />
    </Section>
    <Section>
      {withPorts && (
        <>
          <FailureItem label="No Access" portID={failurePortID} />
          <SuccessItem label="Success" portID={successPortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedReminderStep: React.FC<ConnectedStepProps<NodeData.Reminder>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return (
    <ReminderStep label={transformVariablesToReadable(data.text)} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />
  );
};

export default ConnectedReminderStep;
