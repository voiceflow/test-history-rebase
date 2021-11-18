import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import Step, { ConnectedStep, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';

interface Expression {
  name?: string;
  label: JSX.Element | null;
  portID: string;
}

export interface IfStepProps {
  nodeID: string;
  expressions: Expression[];
  noMatchPortID: string;
  noMatchPathName: string;
  withNoMatchPort: boolean;
}

export const IfStep: React.FC<IfStepProps> = ({ nodeID, expressions, noMatchPortID, noMatchPathName, withNoMatchPort }) => (
  <Step nodeID={nodeID}>
    <Section>
      {expressions.length ? (
        expressions.map(({ label, name, portID }, index) => (
          <Item
            key={portID}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={name || label}
            portID={portID}
            iconColor={NODE_CONFIG.iconColor}
            placeholder="Name conditional path"
            multilineLabel
          />
        ))
      ) : (
        <Item icon="if" iconColor="#f86683" placeholder="Add a Condition" />
      )}
    </Section>

    {withNoMatchPort && <ElseItem portID={noMatchPortID} label={noMatchPathName} />}
  </Step>
);

const ConnectedIfStep: ConnectedStep<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ node, data, engine }) => {
  const noMatchPortID = node.ports.out.builtIn[Models.PortType.NO_MATCH];

  const expressionsByPortID = useSyncedLookup(node.ports.out.dynamic, data.expressions);
  const hasNoMatchLink = engine.hasLinksByPortID(noMatchPortID); // also show the else port if a link exists
  const withNoMatchPort = hasNoMatchLink || data.noMatch.type === Node.IfV2.IfNoMatchType.PATH;

  const expressions = React.useMemo(
    () =>
      node.ports.out.dynamic
        .filter((portID) => expressionsByPortID[portID])
        .map((portID) => {
          const expression = expressionsByPortID[portID];

          return {
            name: expression.name,
            label: expression.value.length > 0 ? <Text>{expressionPreview(expression)}</Text> : null,
            portID,
          };
        }),
    [node.ports.out.dynamic, expressionsByPortID]
  );

  return (
    <IfStep
      nodeID={node.id}
      expressions={expressions}
      noMatchPortID={noMatchPortID}
      noMatchPathName={data.noMatch.pathName ?? ''}
      withNoMatchPort={withNoMatchPort}
    />
  );
};

export default ConnectedIfStep;
