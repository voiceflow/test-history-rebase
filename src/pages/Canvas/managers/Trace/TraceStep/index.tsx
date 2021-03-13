import React from 'react';

import { useSyncedLookup } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

export type TraceStepProps = {
  nodeID: string;
  name: string;
  paths: { label: string; isDefault?: boolean; portID: string }[];
  withPorts: boolean;
};

export const TraceStep: React.FC<TraceStepProps> = ({ nodeID, name, paths, withPorts }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="inFlow" iconColor="#5589eb" label={name} placeholder="Enter Trace Name" multilineLabel />
    </Section>
    {withPorts && (
      <Section>
        {paths.map((path) => {
          const Container = path.isDefault ? SuccessItem : Item;
          return <Container key={path.portID} label={path.label} placeholder="Enter Path Name" portID={path.portID} multilineLabel />;
        })}
      </Section>
    )}
  </Step>
);

const ConnectedTraceStep: React.FC<ConnectedStepProps<NodeData.Trace>> = ({ node, data, withPorts }) => {
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

  return <TraceStep nodeID={node.id} name={data.name} paths={paths} withPorts={withPorts} />;
};

export default ConnectedTraceStep;
