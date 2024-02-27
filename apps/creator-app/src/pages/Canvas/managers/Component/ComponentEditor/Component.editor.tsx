import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import { ComponentEditorRoot } from './ComponentEditorRoot.component';

export const ComponentEditor: NodeEditorV2<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = () => (
  <EditorV2.Route component={ComponentEditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
