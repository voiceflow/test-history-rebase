import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { useSyncedLookup } from '@/hooks';
import Step, { ElseStepItemV2, Item, Section } from '@/pages/Canvas/components/Step';
import { NoMatchV2 } from '@/pages/Canvas/managers/components';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { expressionPreview } from '@/utils/expression';

import { IF_V2_ICON } from '../constants';

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
  palette: HSLShades;
}

export const IfStep: React.FC<IfStepProps> = ({ nodeID, expressions, noMatchPortID, noMatchPathName, withNoMatchPort, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      {expressions.length ? (
        expressions.map(({ label, name, portID }, index) => (
          <Item
            key={portID}
            icon={index === 0 ? IF_V2_ICON : null}
            label={name || label}
            portID={portID}
            palette={palette}
            placeholder="Add condition label"
            multilineLabel
          />
        ))
      ) : (
        <Item icon={IF_V2_ICON} palette={palette} placeholder="Add a Condition" />
      )}

      {withNoMatchPort && <ElseStepItemV2 portID={noMatchPortID} label={noMatchPathName} palette={palette} parentActionsPath={NoMatchV2.PATH} />}
    </Section>
  </Step>
);

const ConnectedIfStep: ConnectedStep<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ ports, data, engine, palette }) => {
  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];

  const hasNoMatchLink = engine.hasLinksByPortID(noMatchPortID); // also show the else port if a link exists
  const expressionsByPortID = useSyncedLookup(ports.out.dynamic, data.expressions);
  const withNoMatchPort = hasNoMatchLink || data.noMatch.type === BaseNode.IfV2.IfNoMatchType.PATH;

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
      palette={palette}
    />
  );
};

export default ConnectedIfStep;
