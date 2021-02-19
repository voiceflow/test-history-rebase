import _isEqual from 'lodash/isEqual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { AccountLinking } from '@/models';
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
  accountLinkingData?: AccountLinking;
};

const ConnectedAccountLinkingStep: React.FC<ConnectedAccountLinkingStepProps> = ({ node, accountLinkingData }) => {
  const notEmpty = !_isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return <AccountLinkingStep portID={node.ports.out[0]} isConfigured={!!accountLinkingData && notEmpty} />;
};

const mapStateToProps = {
  accountLinkingData: Skill.accountLinkingSelector,
};

export default connect(mapStateToProps)(ConnectedAccountLinkingStep);
