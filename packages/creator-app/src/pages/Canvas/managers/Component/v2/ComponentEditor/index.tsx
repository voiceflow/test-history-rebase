import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import ComponentRootEditor from './components/ComponentRootEditor';

const ComponentEditor: NodeEditorV2<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = () => (
  <Switch>
    <Route path={Path.CANVAS_NODE} component={ComponentRootEditor} />
  </Switch>
);

export default ComponentEditor;
