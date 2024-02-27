import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import Form from './Form';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>();

  return <Form editor={editor} />;
};

export default RootEditor;
