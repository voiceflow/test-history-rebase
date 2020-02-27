import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

const PermissionStep = ({ permissions, isConnected, onClickPort, withPort = true, isActive }) => {
  const labelText = (
    <>
      <VariableLabel>Request:</VariableLabel>
      {` ${permissions.join(', ')}`}
    </>
  );

  return (
    <Step isActive={isActive}>
      <Section>
        <Item
          label={!!permissions.length && labelText}
          labelVariant={StepLabelVariant.SECONDARY}
          isConnected={isConnected}
          onClickPort={onClickPort}
          withPort={withPort}
          icon="openLock"
          iconColor="#6e849a"
          placeholder="Send a permissions card"
        />
      </Section>
    </Step>
  );
};
export default PermissionStep;
