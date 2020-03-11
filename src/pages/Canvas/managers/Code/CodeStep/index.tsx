import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

export type CodeStepProps = ConnectedStepProps['stepProps'] & {
  codeAdded: boolean;
  successPortID: string;
  failurePortID: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ codeAdded, withPorts, successPortID, failurePortID, isActive, onClick }) => (
  <Step isActive={isActive} onClick={onClick}>
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

const ConnectedCodeStep: React.FC<ConnectedStepProps<NodeData.Code>> = ({ node, data, stepProps }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <CodeStep codeAdded={!!data.code} successPortID={successPortID} failurePortID={failurePortID} {...stepProps} />;
};

export default ConnectedCodeStep;
