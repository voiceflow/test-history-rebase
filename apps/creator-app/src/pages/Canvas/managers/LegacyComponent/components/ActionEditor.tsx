import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { ActionEditor } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: ActionEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = (props) => (
  <Form editor={props} header={<EditorV2.DefaultHeader onBack={props.goBack} />} footer={<Form.Footer editor={props} />} />
);

export default Editor;
