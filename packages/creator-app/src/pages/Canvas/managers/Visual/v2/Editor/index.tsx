import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import VisualRootEditor from './VisualEditorRoot';

const VisualEditor: NodeEditorV2<Realtime.NodeData.Visual, Realtime.NodeData.VisualBuiltInPorts> = () => (
  <Switch>
    <Route path={Path.CANVAS_NODE} component={VisualRootEditor} />
  </Switch>
);

export default VisualEditor;
