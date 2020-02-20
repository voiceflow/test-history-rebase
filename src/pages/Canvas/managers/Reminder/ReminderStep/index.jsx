import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

function Reminder({ label, withPorts = true, isConnectedFail, onClickFailPort, isConnectedSuccess, onClickSuccessPort, isActive }) {
  return (
    <Step isActive={isActive}>
      <Section>
        <Item icon="clock" iconColor="#c998a4" label={label} labelVariant={LabelVariant.SECONDARY} placeholder="Set a reminder" withPort={false} />
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
