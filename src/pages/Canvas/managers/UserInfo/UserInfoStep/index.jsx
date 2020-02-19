import React from 'react';

import Step, { FailureItem, Item, Section, SuccessItem, VariableLabel } from '@/pages/Canvas/components/Step';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

function UserInfo({ userPermissions, withPorts = true, isConnectedFail, onClickFailPort, isConnectedSuccess, onClickSuccessPort, isActive }) {
  return (
    <Step isActive={isActive}>
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
          labelVariant={LabelVariant.SECONDARY}
          placeholder="Request user information"
          withPort={false}
        />
      </Section>
      <Section>
        {withPorts && (
          <>
            <FailureItem label="No Access" isConnected={isConnectedFail} onClickPort={onClickFailPort} />
            <SuccessItem label="Success" isConnected={isConnectedSuccess} onClickPort={onClickSuccessPort} />
          </>
        )}
      </Section>
    </Step>
  );
}

export default UserInfo;
