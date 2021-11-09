import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useSyncedLookup } from '@/hooks';
import Step, { ConnectedStepProps, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

export interface ActionStepProps {
  nodeID: string;
  name: string;
  paths: { label: string; isDefault?: boolean; portID: string }[];
  withPorts: boolean;
}

export const ActionStep: React.FC<ActionStepProps> = ({ nodeID, name, paths, withPorts }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="action" iconColor="#3A5999" label={name} placeholder="Enter custom action name" multilineLabel />
    </Section>
    {withPorts && (
      <Section>
        {paths.map((path) => {
          const Container = path.isDefault ? SuccessItem : Item;
          return <Container key={path.portID} label={path.label} placeholder="Enter path name" portID={path.portID} multilineLabel />;
        })}
      </Section>
    )}
  </Step>
);

const ConnectedActionStep: React.FC<ConnectedStepProps<Realtime.NodeData.Trace>> = ({ node, data, withPorts }) => {
  const pathsByPortID = useSyncedLookup(node.ports.out, data.paths);

  const paths = React.useMemo(
    () =>
      node.ports.out
        .filter((portID) => pathsByPortID[portID])
        .map((portID) => ({
          ...pathsByPortID[portID],
          portID,
        })),
    [pathsByPortID, node.ports.out, data.paths]
  );

  return <ActionStep nodeID={node.id} name={data.name} paths={paths} withPorts={withPorts} />;
};

export default ConnectedActionStep;
