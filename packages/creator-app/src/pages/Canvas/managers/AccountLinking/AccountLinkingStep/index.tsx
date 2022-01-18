import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import _isEqual from 'lodash/isEqual';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { AccountLinkingContext } from '@/pages/Canvas/contexts';

import { EMPTY_ACCOUNT_DATA, NODE_CONFIG } from '../constants';

export interface AccountLinkingStepProps {
  nodeID: string;
  nextPortID: string;
  isConfigured: boolean;
  variant: BlockVariant;
}

export const AccountLinkingStep: React.FC<AccountLinkingStepProps> = ({ isConfigured, nodeID, nextPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={isConfigured && 'Sending Account Linking card'}
        portID={nextPortID}
        variant={variant}
        placeholder="Configure Account Linking"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAccountLinkingStep: ConnectedStep<Realtime.NodeData.AccountLinking, Realtime.NodeData.AccountLinkingBuiltInPorts> = ({
  node,
  variant,
}) => {
  const accountLinkingData = React.useContext(AccountLinkingContext)!;

  const notEmpty = !_isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return (
    <AccountLinkingStep
      nodeID={node.id}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
      isConfigured={!!accountLinkingData && notEmpty}
      variant={variant}
    />
  );
};

export default ConnectedAccountLinkingStep;
