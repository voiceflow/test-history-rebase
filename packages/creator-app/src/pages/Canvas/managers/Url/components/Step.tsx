import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

const UrlStep: ConnectedStep<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = ({ data, ports, palette }) => (
  <Step nodeID={data.nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={data.url}
        portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
        palette={palette}
        placeholder="Enter url"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

export default UrlStep;
