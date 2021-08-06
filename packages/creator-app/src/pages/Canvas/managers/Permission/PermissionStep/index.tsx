import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG, PERMISSION_LABELS } from '../constants';

export interface PermissionStepProps {
  permissions: string[];
  nodeID: string;
  portID: string;
}

export const PermissionStep: React.FC<PermissionStepProps> = ({ permissions, nodeID, portID }) => {
  const labelText = (
    <>
      <VariableLabel>Request:</VariableLabel>
      {` ${permissions.join(', ')}`}
    </>
  );

  return (
    <Step nodeID={nodeID}>
      <Section>
        <Item
          label={permissions.length ? labelText : null}
          icon={NODE_CONFIG.icon}
          portID={portID}
          iconColor={NODE_CONFIG.iconColor}
          placeholder="Send a permissions card"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

const ConnectedPermissionStep: React.FC<ConnectedStepProps<NodeData.Permission>> = ({ node, data }) => (
  <PermissionStep permissions={data.permissions.map((permissionID) => PERMISSION_LABELS[permissionID])} nodeID={node.id} portID={node.ports.out[0]} />
);

export default ConnectedPermissionStep;
