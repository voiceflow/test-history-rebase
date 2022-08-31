import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NodeEditorV2 } from '../../types';
import CommandEditor from './CommandEditor';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Start> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${CommandEditor.PATH}`} component={CommandEditor} />
    <Route path={Path.CANVAS_NODE} component={RootEditor} />
  </Switch>
);

export default Editor;
