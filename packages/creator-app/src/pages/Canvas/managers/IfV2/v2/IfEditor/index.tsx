import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NoMatchV2 } from '../../../components';
import { NodeEditorV2 } from '../../../types';
import IfNoMatchEditor from './components/IfNoMatchEditor';
import IfRootEditor from './components/IfRootEditor';

const IfEditor: NodeEditorV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}`} component={IfNoMatchEditor} />
    <Route path={Path.CANVAS_NODE} component={IfRootEditor} />
  </Switch>
);

export default IfEditor;
