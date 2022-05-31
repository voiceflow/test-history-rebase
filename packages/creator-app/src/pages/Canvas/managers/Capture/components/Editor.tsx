import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NoReplyV2 } from '../../components';
import { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Capture, Realtime.NodeData.CaptureBuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}`} component={NoReplyV2.Editor} />
    <Route path={Path.CANVAS_NODE} component={RootEditor} />
  </Switch>
);

export default Editor;
