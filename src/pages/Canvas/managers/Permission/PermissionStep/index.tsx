import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { PERMISSION_LABELS } from '../constants';

export type PermissionStepProps = ConnectedStepProps['stepProps'] & {
  permissions: string[];
  portID: string;
};

export const PermissionStep: React.FC<PermissionStepProps> = ({ permissions, portID, isActive, withPorts, onClick }) => {
  const labelText = (
    <>
      <VariableLabel>Request:</VariableLabel>
      {` ${permissions.join(', ')}`}
    </>
  );

  return (
    <Step isActive={isActive} onClick={onClick}>
      <Section>
        <Item
          label={permissions.length ? labelText : null}
          labelVariant={StepLabelVariant.SECONDARY}
          portID={withPorts ? portID : null}
          icon="openLock"
          iconColor="#6e849a"
          placeholder="Send a permissions card"
        />
      </Section>
    </Step>
  );
};

const ConnectedPermissionStep: React.FC<ConnectedStepProps<NodeData.Permission>> = ({ node, data, stepProps }) => (
  <PermissionStep permissions={data.permissions.map((permissionID) => PERMISSION_LABELS[permissionID])} portID={node.ports.out[0]} {...stepProps} />
);

export default ConnectedPermissionStep;
