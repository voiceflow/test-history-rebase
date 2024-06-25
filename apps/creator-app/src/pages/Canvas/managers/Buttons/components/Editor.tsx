import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions, Entity, NoMatchV2, NoReplyV2 } from '../../components';
import type { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Entity.PATH} component={Entity.Editor} />
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    <EditorV2.Route path={NoMatchV2.PATH} component={NoMatchV2.Editor} />
    <EditorV2.Route path={NoReplyV2.PATH} component={NoReplyV2.Editor} />
  </EditorV2.Route>
);

export default Editor;
