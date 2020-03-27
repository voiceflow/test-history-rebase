import { isEqual } from 'lodash';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { accountLinkingSelector } from '@/ducks/skill/meta';
import { connect } from '@/hocs';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { EMPTY_ACCOUNT_DATA } from '@/pages/Canvas/managers/AccountLinking/constants';

export type AccountLinkingStepProps = {
  portID: string;
  isConfigured: boolean;
};

export const AccountLinkingStep: React.FC<AccountLinkingStepProps> = ({ isConfigured, portID }) => (
  <Step>
    <Section>
      <Item
        label={isConfigured && 'Sending Account Linking card'}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="accountLinking"
        iconColor="#645f5f"
        portID={portID}
        placeholder="Configure Account Linking"
      />
    </Section>
  </Step>
);

type ConnectedAccountLinkingStepProps = ConnectedStepProps & {
  accountLinkingData?: {
    skipOnEnablement: boolean;
    type: string;
    authorizationUrl: string;
    domains: string[];
    clientId: string;
    scopes: string[];
    accessTokenUrl: string;
    clientSecret: string;
    accessTokenScheme: string;
    defaultTokenExpirationInSeconds: number;
  };
};

const ConnectedAccountLinkingStep: React.FC<ConnectedAccountLinkingStepProps> = ({ node, accountLinkingData }) => {
  const notEmpty = !isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return <AccountLinkingStep portID={node.ports.out[0]} isConfigured={!!accountLinkingData && notEmpty} />;
};

const mapStateToProps = {
  accountLinkingData: accountLinkingSelector,
};

export default connect(mapStateToProps)(ConnectedAccountLinkingStep);
