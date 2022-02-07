import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { PERMISSION_LABELS } from '@/constants';
import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface UserInfoStepProps {
  userPermissions: (string | null)[];
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
  variant: BlockVariant;
}

export const UserInfoStep: React.FC<UserInfoStepProps> = ({ userPermissions, withPorts, nodeID, successPortID, failurePortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        variant={variant}
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
  variant,
}) => (
  <UserInfoStep
    nodeID={data.nodeID}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[Models.PortType.NEXT]}
    failurePortID={ports.out.builtIn[Models.PortType.FAIL]}
    userPermissions={data.permissions.map((permission) => PERMISSION_LABELS[permission.selected!]).filter(Boolean)}
    variant={variant}
  />
);

export default ConnectedUserInfoStep;
