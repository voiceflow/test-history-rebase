import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { APLStep, ImageStep } from './components';

const ConnectedVisualStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({ data, ...props }) => (
  <>
    {data.aplType === BaseNode.Visual.APLType.JSON && <APLStep data={data} {...props} />}
    {data.aplType === BaseNode.Visual.APLType.SPLASH && <ImageStep data={data} {...props} />}
  </>
);

export default ConnectedVisualStep;
