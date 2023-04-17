import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import Chip from '@/pages/Canvas/components/Chip';
import { COMPONENT_CHIP_CLASSNAME, HOME_CHIP_CLASSNAME } from '@/pages/Canvas/constants';
import { ConnectedChip } from '@/pages/Canvas/managers/types';

const StartChip: ConnectedChip<Realtime.NodeData.Start> = ({ ports }) => {
  const isTopic = useSelector(DiagramV2.active.isTopicSelector);

  return (
    <Chip
      name={isTopic ? 'Start' : 'Continue'}
      icon="systemFlag"
      portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      className={isTopic ? HOME_CHIP_CLASSNAME : COMPONENT_CHIP_CLASSNAME}
    />
  );
};

export default StartChip;
