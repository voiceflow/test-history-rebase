import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';

import { Entity, IntentButtons, NoMatchV2, NoReplyV2 } from '../../components';
import { NodeEditorV2 } from '../../types';
import RootEditor from './RootEditor';

const Editor: NodeEditorV2<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = () => (
  <Switch>
    <Route path={`${Path.CANVAS_NODE}/${Entity.PATH}`} component={Entity.Editor} />
    <Route path={`${Path.CANVAS_NODE}/${NoMatchV2.PATH}`} component={NoMatchV2.Editor} />
    <Route path={`${Path.CANVAS_NODE}/${NoReplyV2.PATH}`} component={NoReplyV2.Editor} />
    <Route path={`${Path.CANVAS_NODE}/${IntentButtons.PATH}`} component={IntentButtons.Editor} />
    <Route path={Path.CANVAS_NODE} component={RootEditor} />
  </Switch>
);

export default Editor;
