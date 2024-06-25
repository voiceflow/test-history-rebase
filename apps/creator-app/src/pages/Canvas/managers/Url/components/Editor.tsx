import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const Editor: NodeEditorV2<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = (props) => (
  <Form editor={props} />
);

export default Editor;
