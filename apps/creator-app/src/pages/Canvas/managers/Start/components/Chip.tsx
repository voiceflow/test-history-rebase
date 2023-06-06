import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Chip from '@/pages/Canvas/components/Chip';
import { COMPONENT_CHIP_CLASSNAME } from '@/pages/Canvas/constants';
import { ConnectedChip } from '@/pages/Canvas/managers/types';

const StartChip: ConnectedChip<Realtime.NodeData.Start> = ({ ports }) => (
  <Chip name="Start" icon="systemFlag" portID={ports.out.builtIn[BaseModels.PortType.NEXT]} className={COMPONENT_CHIP_CLASSNAME} />
);

export default StartChip;
