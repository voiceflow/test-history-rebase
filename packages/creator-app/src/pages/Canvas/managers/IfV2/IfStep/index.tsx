import { Node } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { EngineContext } from '@/pages/Canvas/contexts';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';

interface Expression {
  name?: string;
  label: JSX.Element | null;
  portID: string;
}

export interface IfStepProps {
  nodeID: string;
  elsePortID: string;
  elsePathName: string;
  isPath: boolean;
  expressions: Expression[];
}

export const IfStep: React.FC<IfStepProps> = ({ expressions, nodeID, elsePortID, elsePathName, isPath }) => (
  <Step nodeID={nodeID}>
    <Section>
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
    {isPath && <ElseItem portID={elsePortID} label={elsePathName} />}
  </Step>
);

type ConnectedIfStepProps = ConnectedStepProps<Realtime.NodeData.IfV2>;

const ConnectedIfStep: React.FC<ConnectedIfStepProps> = ({ node, data }) => {
  const engine = React.useContext(EngineContext)!;

  const [elsePortID, nodeOutPorts] = React.useMemo(() => Utils.array.head(node.ports.out), [node.ports.out]);
  const expressionsByPortID = useSyncedLookup(nodeOutPorts, data.expressions);
  const hasElseLink = engine.hasLinksByPortID(elsePortID); // also show the else port if a link exists
  const isPath = hasElseLink || data.noMatch.type === Node.IfV2.IfNoMatchType.PATH;

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

  return <IfStep expressions={expressions} nodeID={node.id} elsePortID={elsePortID} elsePathName={data.noMatch.pathName ?? ''} isPath={isPath} />;
};

export default ConnectedIfStep;
