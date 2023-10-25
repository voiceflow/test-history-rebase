import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Chip from '@/pages/Canvas/components/Chip';
import { IntentMapContext } from '@/pages/Canvas/contexts';
import { ConnectedChip } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

const IntentChip: ConnectedChip<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = ({ data, ports }) => {
  const intentMap = React.useContext(IntentMapContext)!;

  const { intent, availability } = data;

  const intentName = intent && intentMap[intent] ? intentMap[intent].name : null;

  return (
    <Chip
      name={intentName}
      icon={availability === BaseNode.Intent.IntentAvailability.LOCAL ? 'intentLocal' : NODE_CONFIG.icon!}
      portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      placeholder="Select intent..."
    />
  );
};

export default IntentChip;
