import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

export type CodeStepProps = {
  codeAdded: boolean;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ codeAdded, withPorts, successPortID, failurePortID }) => (
  <Step>
    <Section>
      <Item
        icon="power"
        label={codeAdded ? 'Custom code added' : null}
        iconColor="#cdad32"
        labelVariant={StepLabelVariant.SECONDARY}
        placeholder="Enter custom code snippet"
      />
    </Section>
    <Section>
      {withPorts && (
        <>
          <FailureItem label="Failure" portID={failurePortID} />
          <SuccessItem label="Success" portID={successPortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedCodeStep: React.FC<ConnectedStepProps<NodeData.Code>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <CodeStep codeAdded={!!data.code} withPorts={withPorts} successPortID={successPortID} failurePortID={failurePortID} />;
};

export default ConnectedCodeStep;
