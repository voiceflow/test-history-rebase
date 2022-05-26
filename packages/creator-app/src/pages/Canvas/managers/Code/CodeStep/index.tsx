import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CodeStepProps {
  nodeID: string;
  withCode: boolean;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  palette: HSLShades;
}

export const CodeStep: React.FC<CodeStepProps> = ({ withCode, withPorts, nodeID, successPortID, failurePortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={withCode ? 'Custom code added' : null}
        palette={palette}
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

const ConnectedCodeStep: ConnectedStep<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = ({ ports, data, withPorts, palette }) => (
  <CodeStep
    nodeID={data.nodeID}
    withCode={!!data.code}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    palette={palette}
  />
);

export default ConnectedCodeStep;
