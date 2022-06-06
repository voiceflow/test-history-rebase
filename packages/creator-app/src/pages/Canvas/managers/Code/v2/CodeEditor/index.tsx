import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import CodeRootEditor from './components/CodeRootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Code, Realtime.NodeData.CodeBuiltInPorts> = () => (
  <Switch>
    <Route path={Path.CANVAS_NODE} component={CodeRootEditor} />
  </Switch>
);

export default Editor;
