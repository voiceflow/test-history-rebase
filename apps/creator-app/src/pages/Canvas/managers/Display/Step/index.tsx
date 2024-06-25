import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { APLStep, ImageStep } from './components';

const ConnectedVisualStep: ConnectedStep<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = ({
  data,
  ...props
}) => (
  <>
    {data.aplType === BaseNode.Visual.APLType.JSON && <APLStep data={data} {...props} />}
    {data.aplType === BaseNode.Visual.APLType.SPLASH && <ImageStep data={data} {...props} />}
  </>
);

export default ConnectedVisualStep;
