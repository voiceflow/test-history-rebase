import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ExpressionPreviewContainer } from '@/pages/Canvas/managers/If/IfStep/components';

export type SetStepProps = ConnectedStepProps['stepProps'] & {
  expressions: (JSX.Element | null)[];
  portID: string;
};

export const SetStep: React.FC<SetStepProps> = ({ expressions, onClick, isActive, portID, withPorts }) => (
  <Step isActive={isActive} onClick={onClick}>
    <Section>
      {expressions.length ? (
        expressions.map((label, index) => (
          <Item
            label={label}
            labelVariant={StepLabelVariant.SECONDARY}
            icon={index === 0 ? 'code' : null}
            iconColor="#5590b5"
            key={index}
            portID={index === expressions.length - 1 && withPorts ? portID : null}
            placeholder="Set variable to..."
          />
        ))
      ) : (
        <Item icon="code" iconColor="#5590b5" placeholder="Set variable to..." portID={withPorts ? portID : null} />
      )}
    </Section>
  </Step>
);

type ConnectedSetStepProps = ConnectedStepProps<NodeData.Set>;

const ConnectedSetStep: React.FC<ConnectedSetStepProps> = ({ data, node, stepProps }) => {
  const expressions = data.sets.map(({ variable, expression }) => {
    return variable ? <ExpressionPreview prefix={`{${variable}} = `} expression={expression} container={ExpressionPreviewContainer} /> : null;
  });
  return <SetStep expressions={expressions} portID={node.ports.out[0]} {...stepProps} />;
};

export default ConnectedSetStep;
