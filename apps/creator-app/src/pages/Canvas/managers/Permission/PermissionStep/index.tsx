import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section, VariableLabel } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG, PERMISSION_LABELS } from '../constants';

export interface PermissionStepProps {
  nodeID: string;
  nextPortID: string;
  permissions: string[];
  palette: HSLShades;
}

export const PermissionStep: React.FC<PermissionStepProps> = ({ permissions, nodeID, nextPortID, palette }) => {
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
          palette={palette}
          placeholder="Send a permissions card"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

const ConnectedPermissionStep: ConnectedStep<
  Realtime.NodeData.Permission,
  Realtime.NodeData.PermissionBuiltInPorts
> = ({ ports, data, palette }) => (
  <PermissionStep
    nodeID={data.nodeID}
    permissions={data.permissions.map((permissionID) => PERMISSION_LABELS[permissionID])}
    nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    palette={palette}
  />
);

export default ConnectedPermissionStep;
