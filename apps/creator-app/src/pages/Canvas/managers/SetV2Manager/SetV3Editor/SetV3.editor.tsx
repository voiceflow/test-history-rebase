import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import { SetV3EditorRoot } from './SetV3EditorRoot.component';

export const SetV3Editor: NodeEditorV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = () => (
  <EditorV2.Route component={SetV3EditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
