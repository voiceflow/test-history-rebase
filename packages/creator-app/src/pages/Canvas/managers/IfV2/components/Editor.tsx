import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Actions, NoMatchV2 } from '@/pages/Canvas/managers/components';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import NoMatchEditor from './NoMatchEditor';
import RootEditor from './RootEditor';

const IfEditor: NodeEditorV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = () => (
  <EditorV2.Route component={RootEditor}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />

    <EditorV2.Route path={NoMatchV2.PATH} component={NoMatchEditor}>
      <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
    </EditorV2.Route>
  </EditorV2.Route>
);

export default IfEditor;
