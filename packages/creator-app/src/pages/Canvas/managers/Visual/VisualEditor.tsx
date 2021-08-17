import { Node } from '@voiceflow/base-types';
import React from 'react';

import { NodeData } from '@/models';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { APLEditor, ImageEditor } from './components';

const VisualEditor: NodeEditor<NodeData.Visual> = ({ data, ...props }) => (
  <>
    {data.visualType === Node.Visual.VisualType.APL && <APLEditor data={data} {...props} />}
    {data.visualType === Node.Visual.VisualType.IMAGE && <ImageEditor data={data} {...props} />}
  </>
);

export default VisualEditor;
