import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades, PERMISSION_LABELS } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface UserInfoStepProps {
  userPermissions: (string | null)[];
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const UserInfoStep: React.FC<UserInfoStepProps> = ({ userPermissions, withPorts, nodeID, successPortID, failurePortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        palette={palette}
        label={
          userPermissions.length > 0 && (
            <>
              <VariableLabel>Request: </VariableLabel>
              {userPermissions.join(', ')}
            </>
          )
        }
        labelVariant={StepLabelVariant.SECONDARY}
        placeholder="Request user information"
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

const ConnectedUserInfoStep: ConnectedStep<Realtime.NodeData.UserInfo, Realtime.NodeData.UserInfoBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => (
  <UserInfoStep
    nodeID={data.nodeID}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    userPermissions={data.permissions.map((permission) => PERMISSION_LABELS[permission.selected!]).filter(Boolean)}
    palette={palette}
  />
);

export default ConnectedUserInfoStep;
