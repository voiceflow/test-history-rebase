import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CodeStepProps {
  nodeID: string;
  withCode: boolean;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
}

export const CodeStep: React.FC<CodeStepProps> = ({ withCode, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={withCode ? 'Custom code added' : null}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Enter custom code snippet"
        labelVariant={StepLabelVariant.SECONDARY}
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

const ConnectedCodeStep: ConnectedStep<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ node, data, withPorts }) => (
  <CodeStep
    nodeID={node.id}
    withCode={!!data.code}
    withPorts={withPorts}
    successPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    failurePortID={node.ports.out.builtIn[Models.PortType.FAIL]}
  />
);

export default ConnectedCodeStep;
