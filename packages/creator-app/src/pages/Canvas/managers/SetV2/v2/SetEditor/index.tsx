import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { Actions, NoMatchV2, NoReplyV2 } from '@/pages/Canvas/managers/components';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import SetRootEditor from './components/SetRootEditor';

const NoMatchActionsEditor = EditorV2.withGoBack(NoMatchV2.PATH)(Actions.Editor);
const NoReplyActionsEditor = EditorV2.withGoBack(NoReplyV2.PATH)(Actions.Editor);

const SetEditor: NodeEditorV2<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}/${Actions.PATH}`} component={NoMatchActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}`} component={NoMatchV2.Editor} />

    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}/${Actions.PATH}`} component={NoReplyActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}`} component={NoReplyV2.Editor} />

    <Route path={Path.CANVAS_NODE} component={SetRootEditor} />
  </Switch>
);

export default SetEditor;
