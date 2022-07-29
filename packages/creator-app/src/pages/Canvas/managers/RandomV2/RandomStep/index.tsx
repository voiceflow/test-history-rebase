import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { useSyncedLookup } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

interface Path {
  label: string;
  portID: string;
}

export interface RandomStepProps {
  nodeID: string;
  palette: HSLShades;
  paths: Path[];
}

const RandomStep: ConnectedStep<Realtime.NodeData.RandomV2, Realtime.BuiltInPortRecord<string>> = ({ ports, data, palette }) => {
  const pathsByPortID = useSyncedLookup(ports.out.dynamic, data.namedPaths);

  const paths = React.useMemo(
    () => ports.out.dynamic.filter((portID) => pathsByPortID[portID]).map<Path>((portID) => ({ ...pathsByPortID[portID], portID })),
    [pathsByPortID, ports.out.dynamic, data.namedPaths]
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
            labelVariant={StepLabelVariant.SECONDARY}
          />
        ))}
      </Section>
    </Step>
  );
};

export default RandomStep;
