import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions, NoReplyV2 } from '../../components';
import { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor.component';

const Editor: NodeEditorV2<Realtime.NodeData.AICapture, Realtime.NodeData.AICaptureBuiltInPorts> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    <EditorV2.Route path={NoReplyV2.PATH} component={NoReplyV2.Editor} />
  </EditorV2.Route>
);

export default Editor;
