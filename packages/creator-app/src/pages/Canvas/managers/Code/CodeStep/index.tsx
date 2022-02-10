import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CodeStepProps {
  nodeID: string;
  withCode: boolean;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  variant: BlockVariant;
}

export const CodeStep: React.FC<CodeStepProps> = ({ withCode, withPorts, nodeID, successPortID, failurePortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={withCode ? 'Custom code added' : null}
        variant={variant}
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

const ConnectedCodeStep: ConnectedStep<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ ports, data, withPorts, variant }) => (
  <CodeStep
    nodeID={data.nodeID}
    withCode={!!data.code}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    variant={variant}
  />
);

export default ConnectedCodeStep;
