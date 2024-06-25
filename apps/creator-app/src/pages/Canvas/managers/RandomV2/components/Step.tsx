import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { useSyncedLookup } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

const RandomStep: ConnectedStep<Realtime.NodeData.RandomV2> = ({ ports, data, palette }) => {
  const pathsByPortID = useSyncedLookup(ports.out.dynamic.slice(0, data.namedPaths.length), data.namedPaths);

  const paths = React.useMemo(
    () =>
      ports.out.dynamic
        .filter((portID) => pathsByPortID[portID])
        .map((portID) => ({ label: pathsByPortID[portID].label, portID })),
    [pathsByPortID, ports.out.dynamic]
  );

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        {paths.map((path, index) => (
          <Item
            key={path.portID}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={path.label}
            portID={path.portID}
            palette={palette}
            textColor="#132144"
            labelVariant={StepLabelVariant.SECONDARY}
          />
        ))}
      </Section>
    </Step>
  );
};

export default RandomStep;
