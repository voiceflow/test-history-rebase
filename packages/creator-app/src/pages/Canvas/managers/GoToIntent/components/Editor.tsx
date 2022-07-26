import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: NodeEditorV2<Realtime.NodeData.GoToIntent> = (props) => (
  <EditorV2 header={<EditorV2.DefaultHeader />} footer={<EditorV2.DefaultFooter />}>
    <Form editor={props} />
  </EditorV2>
);

export default Editor;
