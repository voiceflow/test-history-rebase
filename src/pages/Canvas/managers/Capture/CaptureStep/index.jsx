import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

import { VariableLabel } from './components';

const CaptureStep = ({ fromVariable, toVariable, isConnected, onClickPort, withPort = true, isActive }) => (
  <Step isActive={isActive}>
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
        labelVariant="secondary"
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        icon="microphone"
        iconColor="#58457a"
        placeholder="Capture a user response"
      />
    </Section>
  </Step>
);

export default CaptureStep;
