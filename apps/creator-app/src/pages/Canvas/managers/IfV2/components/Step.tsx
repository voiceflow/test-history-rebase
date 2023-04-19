import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import Step, { ElseStepItemV2, Item, Section } from '@/pages/Canvas/components/Step';
import { NoMatchV2 } from '@/pages/Canvas/managers/components';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { expressionPreview } from '@/utils/expression';

import { NODE_CONFIG } from '../constants';

const IfStep: ConnectedStep<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ ports, data, engine, palette }) => {
  const noMatchPortID = ports.out.builtIn[BaseModels.PortType.NO_MATCH];

  const hasNoMatchLink = !!noMatchPortID && engine.hasLinksByPortID(noMatchPortID); // also show the else port if a link exists
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
    <Step nodeID={data.nodeID}>
      <Section>
        {expressions.length ? (
          expressions.map(({ label, name, portID }, index) => (
            <Item
              key={portID}
              icon={index === 0 ? NODE_CONFIG.icon : null}
              label={name || label}
              portID={portID}
              palette={palette}
              placeholder="Add condition label"
              multilineLabel
            />
          ))
        ) : (
          <Item icon={NODE_CONFIG.icon} palette={palette} placeholder="Add a Condition" />
        )}

        {withNoMatchPort && (
          <ElseStepItemV2 portID={noMatchPortID} label={data.noMatch.pathName ?? ''} palette={palette} parentActionsPath={NoMatchV2.PATH} />
        )}
      </Section>
    </Step>
  );
};

export default IfStep;
