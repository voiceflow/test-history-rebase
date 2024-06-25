import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface ReminderStepProps {
  label: string;
  nodeID: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const ReminderStep: React.FC<ReminderStepProps> = ({
  label,
  withPorts,
  nodeID,
  successPortID,
  failurePortID,
  palette,
}) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        palette={palette}
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

const ConnectedReminderStep: ConnectedStep<Realtime.NodeData.Reminder, Realtime.NodeData.ReminderBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => (
  <ReminderStep
    label={transformVariablesToReadable(data.text)}
    nodeID={data.nodeID}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    palette={palette}
  />
);

export default ConnectedReminderStep;
