import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

function CodeStep({ codeAdded, withPorts = true, isConnectedFail, onClickFailPort, isConnectedSuccess, onClickSuccessPort, isActive }) {
  return (
    <Step isActive={isActive}>
      <Section>
        <Item
          icon="power"
          label={codeAdded && 'Custom code added'}
          withPort={false}
          iconColor="#cdad32"
          labelVariant={LabelVariant.SECONDARY}
          placeholder="Enter custom code snippet"
        />
      </Section>
      <Section>
        {withPorts && (
          <>
            <FailureItem label="Failure" isConnected={isConnectedFail} onClickPort={onClickFailPort} />
            <SuccessItem label="Success" isConnected={isConnectedSuccess} onClickPort={onClickSuccessPort} />
          </>
        )}
      </Section>
    </Step>
  );
}

export default CodeStep;
