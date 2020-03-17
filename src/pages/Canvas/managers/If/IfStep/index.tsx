import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import { StepLabelVariant } from '@/constants/canvas';
import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { head } from '@/utils/array';

import { ExpressionPreviewContainer } from './components';

export type IfStepProps = ConnectedStepProps['stepProps'] & {
  elsePortID: string;
  expressions: {
    label: JSX.Element;
    portID: string;
  }[];
};

export const IfStep: React.FC<IfStepProps> = ({ expressions, elsePortID, lockOwner, withPorts, isActive, onClick }) => {
  return (
    <Step isActive={isActive} onClick={onClick} lockOwner={lockOwner}>
      <Section>
        {expressions.length ? (
          expressions.map(({ label, portID }, index) => {
            return (
              <Item
                key={portID}
                icon={index === 0 ? 'if' : null}
                label={label}
                labelVariant={StepLabelVariant.SECONDARY}
                iconColor="#f86683"
                portID={withPorts ? portID : null}
                placeholder="Add IF statement"
              />
            );
          })
        ) : (
          <Item icon="if" iconColor="#f86683" placeholder="Add IF statement" />
        )}
      </Section>
      <ElseItem portID={elsePortID} />
    </Step>
  );
};

type ConnectedIfStepProps = ConnectedStepProps<NodeData.If>;

const ConnectedIfStep: React.FC<ConnectedIfStepProps> = ({ node, data, stepProps }) => {
  const [elsePortID, nodeOutPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
  const expressionsByPortID = useSyncedLookup(nodeOutPorts, data.expressions);

  const expressions = nodeOutPorts
    .filter((portID) => expressionsByPortID[portID])
    .map((portID) => {
      const expression = expressionsByPortID[portID];

      return {
        label: <ExpressionPreview expression={expression} container={ExpressionPreviewContainer} singleLine />,
        portID,
      };
    });

  return <IfStep expressions={expressions} {...stepProps} elsePortID={elsePortID} />;
};

export default ConnectedIfStep;
