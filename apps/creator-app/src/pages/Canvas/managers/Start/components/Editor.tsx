import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import CommandEditor from './CommandEditor';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Start> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    <EditorV2.Route path={CommandEditor.PATH} component={CommandEditor} />
  </EditorV2.Route>
);

export default Editor;
