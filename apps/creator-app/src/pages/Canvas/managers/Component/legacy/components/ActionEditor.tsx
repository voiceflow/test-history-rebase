import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ActionEditor } from '@/pages/Canvas/managers/types';

import { ComponentEditorBase } from '../../ComponentEditor/ComponentEditorBase.component';

const Editor: ActionEditor<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = () => {
  return <ComponentEditorBase />;
};

export default Editor;
