import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ConnectedStep } from '@/pages/Canvas/managers/types';

import APLStep from './APLStep';
import ImageStep from './ImageStep';

const VisualStep: ConnectedStep<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = ({ data, ...props }) => (
  <>
    {data.visualType === BaseNode.Visual.VisualType.APL && <APLStep data={data} {...props} />}
    {data.visualType === BaseNode.Visual.VisualType.IMAGE && <ImageStep data={data} {...props} />}
  </>
);

export default VisualStep;
