import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import type { ActionEditor } from '@/pages/Canvas/managers/types';

import ActionRootEditor from './ActionRootEditor';
import TLSEditor from './TLSEditor';

const ApiActionEditor: ActionEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = () => (
  <EditorV2.Route path="" component={ActionRootEditor}>
    <EditorV2.Route path={TLSEditor.PATH} component={TLSEditor} />
  </EditorV2.Route>
);

export default ApiActionEditor;
