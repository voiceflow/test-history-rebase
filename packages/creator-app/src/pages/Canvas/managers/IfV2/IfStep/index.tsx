import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants';
import { useSyncedLookup } from '@/hooks';
import Step, { ConnectedStep, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';

interface Expression {
  name?: string;
  label: string | null;
  portID: string;
}

export interface IfStepProps {
  nodeID: string;
  expressions: Expression[];
  noMatchPortID: string;
  noMatchPathName: string;
  withNoMatchPort: boolean;
  variant: BlockVariant;
}

export const IfStep: React.FC<IfStepProps> = ({ nodeID, expressions, noMatchPortID, noMatchPathName, withNoMatchPort, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      {expressions.length ? (
        expressions.map(({ label, name, portID }, index) => (
          <Item
            key={portID}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={name || label}
            portID={portID}
            variant={variant}
            placeholder="Name conditional path"
            multilineLabel
          />
        ))
      ) : (
        <Item icon="if" variant={variant} placeholder="Add a Condition" />
      )}
    </Section>

    {withNoMatchPort && <ElseItem portID={noMatchPortID} label={noMatchPathName} variant={variant} />}
  </Step>
);

const ConnectedIfStep: ConnectedStep<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ ports, data, engine, variant }) => {
  const noMatchPortID = ports.out.builtIn[Models.PortType.NO_MATCH];

  const hasNoMatchLink = engine.hasLinksByPortID(noMatchPortID); // also show the else port if a link exists
  const expressionsByPortID = useSyncedLookup(ports.out.dynamic, data.expressions);
  const withNoMatchPort = hasNoMatchLink || data.noMatch.type === Node.IfV2.IfNoMatchType.PATH;

  const expressions = React.useMemo(
    () =>
      ports.out.dynamic
        .filter((portID) => expressionsByPortID[portID])
        .map((portID) => {
          const expression = expressionsByPortID[portID];

          return {
            name: expression.name,
            label: expression.value.length > 0 ? expressionPreview(expression) : null,
            portID,
          };
        }),
    [ports.out.dynamic, expressionsByPortID]
  );

  return (
    <IfStep
      nodeID={data.nodeID}
      expressions={expressions}
      noMatchPortID={noMatchPortID}
      noMatchPathName={data.noMatch.pathName ?? ''}
      withNoMatchPort={withNoMatchPort}
      variant={variant}
    />
  );
};

export default ConnectedIfStep;
