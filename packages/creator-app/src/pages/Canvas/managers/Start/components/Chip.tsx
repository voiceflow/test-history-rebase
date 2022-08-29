import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import Chip from '@/pages/Canvas/components/Chip';
import { FLOW_CHIP_CLASSNAME, HOME_CHIP_CLASSNAME } from '@/pages/Canvas/constants';
import { ConnectedChip } from '@/pages/Canvas/managers/types';

const StartChip: ConnectedChip<Realtime.NodeData.Start> = ({ ports }) => {
  const isRootDiagram = useSelector(CreatorV2.isRootDiagramActiveSelector);

  return (
    <Chip
      name={isRootDiagram ? 'Start' : 'Continues Here'}
      icon="systemFlag"
      portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      className={isRootDiagram ? HOME_CHIP_CLASSNAME : FLOW_CHIP_CLASSNAME}
    />
  );
};

export default StartChip;
