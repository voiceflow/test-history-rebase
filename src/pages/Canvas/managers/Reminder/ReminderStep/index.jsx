import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

function Reminder({ label, withPorts = true, isConnectedFail, onClickFailPort, isConnectedSuccess, onClickSuccessPort, isActive }) {
  return (
    <Step isActive={isActive}>
      <Section>
        <Item
          icon="clock"
          iconColor="#c998a4"
          label={label}
          labelVariant={StepLabelVariant.SECONDARY}
          placeholder="Set a reminder"
          withPort={false}
        />
      </Section>
      <Section>
        {withPorts && (
          <>
            <FailureItem label="No Access" isConnected={isConnectedFail} onClickPort={onClickFailPort} />
            <SuccessItem label="Success" isConnected={isConnectedSuccess} onClickPort={onClickSuccessPort} />
          </>
        )}
      </Section>
    </Step>
  );
}

export default Reminder;
