import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Actions, NoMatchV2 } from '@/pages/Canvas/managers/components';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import NoMatchEditor from './NoMatchEditor';
import RootEditor from './RootEditor';

const NoMatchActionsEditor = EditorV2.withGoBack(NoMatchV2.PATH)(Actions.Editor);

const IfEditor: NodeEditorV2<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}/${Actions.PATH}`} component={NoMatchActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}`} component={NoMatchEditor} />

    <Route path={`${Path.CANVAS_NODE}/${Actions.PATH}`} component={Actions.Editor} />
    <Route path={Path.CANVAS_NODE} component={RootEditor} />
  </Switch>
);

export default IfEditor;
