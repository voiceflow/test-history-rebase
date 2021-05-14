import _isEqual from 'lodash/isEqual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { AccountLinkingContext } from '@/pages/Canvas/contexts';

import { EMPTY_ACCOUNT_DATA, NODE_CONFIG } from '../constants';

export interface AccountLinkingStepProps {
  nodeID: string;
  portID: string;
  isConfigured: boolean;
}

export const AccountLinkingStep: React.FC<AccountLinkingStepProps> = ({ isConfigured, nodeID, portID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={isConfigured && 'Sending Account Linking card'}
        portID={portID}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Configure Account Linking"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAccountLinkingStep: React.FC<ConnectedStepProps> = ({ node }) => {
  const accountLinkingData = React.useContext(AccountLinkingContext)!;

  const notEmpty = !_isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return <AccountLinkingStep nodeID={node.id} portID={node.ports.out[0]} isConfigured={!!accountLinkingData && notEmpty} />;
};

export default ConnectedAccountLinkingStep;
