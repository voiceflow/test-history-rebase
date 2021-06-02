import React from 'react';

import ExpressionPreview from '@/components/ExpressionEditor/components/ExpressionPreview';
import { StepLabelVariant } from '@/constants/canvas';
import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { head } from '@/utils/array';

import { NODE_CONFIG } from '../constants';
import { ExpressionPreviewContainer } from './components';

export type IfStepProps = {
  nodeID: string;
  elsePortID: string;
  expressions: {
    label: JSX.Element;
    portID: string;
  }[];
};

export const IfStep: React.FC<IfStepProps> = ({ expressions, nodeID, elsePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      {expressions.length ? (
        expressions.map(({ label, portID }, index) => (
          <Item
            key={portID}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={label}
            labelVariant={StepLabelVariant.SECONDARY}
            iconColor={NODE_CONFIG.iconColor}
            portID={portID}
            placeholder="Add IF statement"
          />
        ))
      ) : (
        <Item icon="if" iconColor="#f86683" placeholder="Add IF statement" />
      )}
    </Section>
    <ElseItem portID={elsePortID} />
  </Step>
);

type ConnectedIfStepProps = ConnectedStepProps<NodeData.If>;

const ConnectedIfStep: React.FC<ConnectedIfStepProps> = ({ node, data }) => {
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

  return <IfStep expressions={expressions} nodeID={node.id} elsePortID={elsePortID} />;
};

export default ConnectedIfStep;
