import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NodeEditorV2 } from '../../../types';
import IntegrationRootEditor from './IntegrationRootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = () => (
  <Switch>
    <Route path={Path.CANVAS_NODE} component={IntegrationRootEditor} />
  </Switch>
);

export default Editor;
