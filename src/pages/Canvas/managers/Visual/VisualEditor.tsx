import { VisualType } from '@voiceflow/general-types/build/nodes/visual';
import React from 'react';

import { NodeData } from '@/models';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { APLEditor, ImageEditor } from './components';

const VisualEditor: NodeEditor<NodeData.Visual> = ({ data, ...props }) => (
  <>
    {data.visualType === VisualType.APL && <APLEditor data={data} {...props} />}
    {data.visualType === VisualType.IMAGE && <ImageEditor data={data} {...props} />}
  </>
);

export default VisualEditor;
