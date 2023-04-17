import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions, Entity } from '../../components';
import { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Entity.PATH} component={Entity.Editor} />
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);

export default Editor;
