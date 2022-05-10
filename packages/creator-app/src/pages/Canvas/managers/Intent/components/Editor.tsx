import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { Entity } from '../../components';
import { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${Entity.PATH}`} component={Entity.Editor} />
    <Route path={Path.CANVAS_NODE} component={RootEditor} />
  </Switch>
);

export default Editor;
