import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import EditorV2 from '../../../components/EditorV2';
import { Actions, Entity, NoMatchV2, NoReplyV2 } from '../../components';
import { NodeEditorV2 } from '../../types';
import Buttons from './Buttons';
import Root from './Root';

const EntityEditor = EditorV2.withGoBack(Buttons.PATH)(Entity.Editor);
const ActionsEditor = EditorV2.withGoBack(Buttons.PATH)(Actions.Editor);
const NoMatchActionsEditor = EditorV2.withGoBack(NoMatchV2.PATH)(Actions.Editor);
const NoReplyActionsEditor = EditorV2.withGoBack(NoReplyV2.PATH)(Actions.Editor);

const CardV2Editor: NodeEditorV2<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}/${Actions.PATH}`} component={NoMatchActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}`} component={NoMatchV2.Editor} />

    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}/${Actions.PATH}`} component={NoReplyActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}`} component={NoReplyV2.Editor} />

    <Route path={`${Path.CANVAS_NODE}/${Buttons.PATH}/${Actions.PATH}`} component={ActionsEditor} />
    <Route path={`${Path.CANVAS_NODE}/${Buttons.PATH}/${Entity.PATH}`} component={EntityEditor} />
    <Route path={`${Path.CANVAS_NODE}/${Buttons.PATH}`} component={Buttons.Editor} />

    <Route path={Path.CANVAS_NODE} component={Root} />
  </Switch>
);

export default CardV2Editor;
