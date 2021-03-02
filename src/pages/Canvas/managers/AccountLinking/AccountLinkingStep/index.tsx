import _isEqual from 'lodash/isEqual';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { AccountLinking } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { EMPTY_ACCOUNT_DATA, NODE_CONFIG } from '../constants';

export type AccountLinkingStepProps = {
  nodeID: string;
  portID: string;
  isConfigured: boolean;
};

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

type ConnectedAccountLinkingStepProps = ConnectedStepProps & {
  accountLinkingData?: AccountLinking;
};

const ConnectedAccountLinkingStep: React.FC<ConnectedAccountLinkingStepProps> = ({ node, accountLinkingData }) => {
  const notEmpty = !_isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return <AccountLinkingStep nodeID={node.id} portID={node.ports.out[0]} isConfigured={!!accountLinkingData && notEmpty} />;
};

const mapStateToProps = {
  accountLinkingData: Skill.accountLinkingSelector,
};

export default connect(mapStateToProps)(ConnectedAccountLinkingStep);
