import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import _isEqual from 'lodash/isEqual';
import React from 'react';

import type { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { AccountLinkingContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { EMPTY_ACCOUNT_DATA, NODE_CONFIG } from '../constants';

export interface AccountLinkingStepProps {
  nodeID: string;
  nextPortID: string;
  isConfigured: boolean;
  palette: HSLShades;
}

export const AccountLinkingStep: React.FC<AccountLinkingStepProps> = ({
  isConfigured,
  nodeID,
  nextPortID,
  palette,
}) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={isConfigured && 'Sending Account Linking card'}
        portID={nextPortID}
        palette={palette}
        placeholder="Configure Account Linking"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedAccountLinkingStep: ConnectedStep<
  Realtime.NodeData.AccountLinking,
  Realtime.NodeData.AccountLinkingBuiltInPorts
> = ({ ports, data, palette }) => {
  const accountLinkingData = React.useContext(AccountLinkingContext)!;

  const notEmpty = !_isEqual(accountLinkingData, EMPTY_ACCOUNT_DATA);

  return (
    <AccountLinkingStep
      nodeID={data.nodeID}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      isConfigured={!!accountLinkingData && notEmpty}
      palette={palette}
    />
  );
};

export default ConnectedAccountLinkingStep;
