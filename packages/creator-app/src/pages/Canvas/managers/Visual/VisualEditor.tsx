import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditor } from '@/pages/Canvas/managers/types';

import { APLEditor, ImageEditor } from './components';

const VisualEditor: NodeEditor<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = ({ data, ...props }) => (
  <>
    {data.visualType === Node.Visual.VisualType.APL && <APLEditor data={data} {...props} />}
    {data.visualType === Node.Visual.VisualType.IMAGE && <ImageEditor data={data} {...props} />}
  </>
);

export default VisualEditor;
