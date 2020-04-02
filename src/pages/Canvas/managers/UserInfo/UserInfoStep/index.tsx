import React from 'react';

import { PERMISSION_LABELS } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';

export type UserInfoStepProps = {
  userPermissions: (string | null)[];
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
};

export const UserInfoStep: React.FC<UserInfoStepProps> = ({ userPermissions, withPorts, successPortID, failurePortID }) => (
  <Step>
    <Section>
      <Item
        icon="barGraph"
        iconColor="#3C6997"
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
          <FailureItem label="No Access" portID={failurePortID} />
          <SuccessItem label="Success" portID={successPortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedUserInfoStep: React.FC<ConnectedStepProps<NodeData.UserInfo>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return (
    <UserInfoStep
      userPermissions={data.permissions.map((permission) => PERMISSION_LABELS[permission.selected!]).filter(Boolean)}
      successPortID={successPortID}
      failurePortID={failurePortID}
      withPorts={withPorts}
    />
  );
};

export default ConnectedUserInfoStep;
