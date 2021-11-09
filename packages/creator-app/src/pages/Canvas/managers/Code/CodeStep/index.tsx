import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CodeStepProps {
  codeAdded: boolean;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
}

export const CodeStep: React.FC<CodeStepProps> = ({ codeAdded, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={codeAdded ? 'Custom code added' : null}
        iconColor={NODE_CONFIG.iconColor}
        labelVariant={StepLabelVariant.SECONDARY}
        placeholder="Enter custom code snippet"
      />
    </Section>
    <Section>
      {withPorts && (
        <>
          <SuccessItem label="Success" portID={successPortID} />
          <FailureItem label="Failure" portID={failurePortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedCodeStep: React.FC<ConnectedStepProps<Realtime.NodeData.Code>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <CodeStep codeAdded={!!data.code} withPorts={withPorts} nodeID={node.id} successPortID={successPortID} failurePortID={failurePortID} />;
};

export default ConnectedCodeStep;
