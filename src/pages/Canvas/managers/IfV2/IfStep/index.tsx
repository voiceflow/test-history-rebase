import React from 'react';

import Text from '@/components/Text';
import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { head } from '@/utils/array';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';

export type IfStepProps = {
  nodeID: string;
  elsePortID: string;
  expressions: {
    name?: string;
    label: JSX.Element | null;
    portID: string;
  }[];
};

export const IfStep: React.FC<IfStepProps> = ({ expressions, nodeID, elsePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      {/* eslint-disable-next-line no-nested-ternary */}
      {expressions.length ? (
        expressions.map(({ label, name, portID }, index) => (
          <Item
            multilineLabel
            key={portID}
            label={name || label}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            placeholder="Name conditional path"
            iconColor={NODE_CONFIG.iconColor}
            portID={portID}
          />
        ))
      ) : (
        <Item icon="if" iconColor="#f86683" placeholder="Add a Condition" />
      )}
    </Section>
    <ElseItem portID={elsePortID} />
  </Step>
);

type ConnectedIfStepProps = ConnectedStepProps<NodeData.IfV2>;

const ConnectedIfStep: React.FC<ConnectedIfStepProps> = ({ node, data }) => {
  const [elsePortID, nodeOutPorts] = React.useMemo(() => head(node.ports.out), [node.ports.out]);
  const expressionsByPortID = useSyncedLookup(nodeOutPorts, data.expressions);

  const expressions = nodeOutPorts
    .filter((portID) => expressionsByPortID[portID])
    .map((portID) => {
      const expression = expressionsByPortID[portID];

      return {
        name: expression.name,
        label: expression.value.length > 0 ? <Text>{expressionPreview(expression)}</Text> : null,
        portID,
      };
    });

  return <IfStep expressions={expressions} nodeID={node.id} elsePortID={elsePortID} />;
};

export default ConnectedIfStep;
