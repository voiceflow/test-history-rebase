import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG, PERMISSION_LABELS } from '../constants';

export interface PermissionStepProps {
  nodeID: string;
  nextPortID: string;
  permissions: string[];
  variant: BlockVariant;
}

export const PermissionStep: React.FC<PermissionStepProps> = ({ permissions, nodeID, nextPortID, variant }) => {
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
          portID={nextPortID}
          variant={variant}
          placeholder="Send a permissions card"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

const ConnectedPermissionStep: ConnectedStep<Realtime.NodeData.Permission, Realtime.NodeData.PermissionBuiltInPorts> = ({ ports, data, variant }) => (
  <PermissionStep
    nodeID={data.nodeID}
    permissions={data.permissions.map((permissionID) => PERMISSION_LABELS[permissionID])}
    nextPortID={ports.out.builtIn[Models.PortType.NEXT]}
    variant={variant}
  />
);

export default ConnectedPermissionStep;
