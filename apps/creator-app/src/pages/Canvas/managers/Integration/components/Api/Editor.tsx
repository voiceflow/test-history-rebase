import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Actions } from '@/pages/Canvas/managers/components';
import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import RootEditor from './RootEditor';
import TLSEditor from './TLSEditor';

const Editor: NodeEditorV2<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    <EditorV2.Route path={TLSEditor.PATH} component={TLSEditor} />
  </EditorV2.Route>
);

export default Editor;
