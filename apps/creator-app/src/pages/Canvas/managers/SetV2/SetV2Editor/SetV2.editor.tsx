import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import { SetV2EditorRoot } from './SetV2EditorRoot.component';

export const SetV2Editor: NodeEditorV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = () => (
  <EditorV2.Route component={SetV2EditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
