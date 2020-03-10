import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

export type CodeStepProps = ConnectedStepProps['stepProps'] & {
  codeAdded: boolean;
  successPort: string;
  failPort: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ codeAdded, withPorts, successPort, failPort, isActive, onClick }) => (
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
          <FailureItem label="Failure" portID={successPort} />
          <SuccessItem label="Success" portID={failPort} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedCodeStep: React.FC<ConnectedStepProps<NodeData.Code>> = ({ node, data, stepProps }) => {
  const [successPort, failPort] = node.ports.out;

  return <CodeStep codeAdded={!!data.code} successPort={successPort} failPort={failPort} {...stepProps} />;
};

export default ConnectedCodeStep;
